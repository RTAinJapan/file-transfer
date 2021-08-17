import logger from './logger';
import configModule from 'config';
import { converDateToStr, execCommand, find, isFileExist, readFileText, removeFile, s3mv, statFile, writeTextFile } from './util';
import axios from 'axios';
import path from 'path';

const config: Config = configModule.util.toObject(configModule);

export const checkEnv = async () => {
  try {
    // AWS CLIでS3のチェック
    const s3path = `s3://${config.aws.bucket}/${config.aws.dir}/`;
    logger.info(`[checkEnv] AWS S3=${s3path}`);
    let ret: any = await execCommand(`aws s3 ls ${s3path}`);
    logger.info(ret);

    // 監視対象のチェック
    logger.info(`[checkEnv] 監視対象のディレクトリの存在チェック dir=${config.watch.targetDir}`);
    ret = await isFileExist(config.watch.targetDir);
    logger.info(ret);

    logger.info(`[checkEnv] 現在の監視対象ファイル`);
    ret = await find(`${config.watch.targetDir}/*${config.watch.ext}`);
    logger.info(JSON.stringify(ret));

    // WebHookのチェック
    if (config.discord.webhook) {
      logger.info('[checkEnv] exec Discord WebHook');
      await discordWebSocketHeartbeat();
    } else {
      logger.info('[checkEnv] Discord WebHook無し');
    }
  } catch (e) {
    logger.error(JSON.stringify(e));
    await sendDiscord('[checkEnv][ERROR] 起動時確認で死んだ');
    throw new Error('');
  }
};

const sendDiscord = async (message: string): Promise<void> => {
  const url = config.discord.webhook;
  if (!url) return;
  try {
    await axios.post(url, {
      content: message,
    });
  } catch (e) {
    logger.error(e);
  }
};

export const discordWebSocketHeartbeat = () => {
  return sendDiscord('ファイル転送監視は動作しています');
};

const getAndWriteTwitchTitle = async () => {
  const title = await getTwitchTitle();
  if (!title) return '';
  const fixedTitle = title.replace('/', '').replace('|', '').replace('\\', '').replace(':', ' -').trim();

  await writeTextFile('./data/twitch.csv', fixedTitle);
  return fixedTitle;
};

const getTwitchTitle = async () => {
  try {
    const headers = {
      'Client-Id': config.twitch.ClientId,
    };
    // Twitchに未ログイン状態でアクセスした時に投げてる内容
    const body = [
      {
        extensions: {
          persistedQuery: {
            sha256Hash: 'e1edae8122517d013405f237ffcc124515dc6ded82480a88daef69c83b53ac01',
            version: 1,
          },
        },
        operationName: 'ComscoreStreamingQuery',
        variables: {
          channel: 'rtainjapan',
          clipSlug: '',
          isClip: false,
          isLive: true,
          isVodOrCollection: false,
          vodID: '',
        },
      },
    ];

    const response = await axios.post('https://gql.twitch.tv/gql', body, { headers });
    const jsonList = response.data as TwitchGQLResponse;
    if (jsonList.length === 0) return '';

    const title = jsonList[0].data.user.broadcastSettings.title;
    return title;
  } catch (e) {
    return '';
  }
};

export const checkAndMoveFile = async () => {
  const id = `${new Date().getTime()}`;

  try {
    const files = await find(`${config.watch.targetDir}/*${config.watch.ext}`);

    // ファイル情報を取得
    let fileInfoList: { filePath: string; createDate: Date }[] = [];
    for (const file of files) {
      const info = await statFile(file);
      fileInfoList.push({
        filePath: file,
        createDate: info.birthtime,
      });
    }

    if (fileInfoList.length < 2) {
      logger.info(`[${id}] ファイル数が既定数以下なので終了`);
      return;
    }

    // 3つ以上あるとファイル名つけるのに困るので通知する
    const isFilenameChange = fileInfoList.length === 2;
    if (!isFilenameChange) {
      await sendDiscord('何らかの理由でファイルが3つ以上あるため、ファイル名変換は行わずにアップロードします');
    }

    // ソートして一番新しいものを除外
    fileInfoList = fileInfoList.sort((a, b) => {
      if (a.createDate > b.createDate) return 1;
      if (a.createDate < b.createDate) return -1;
      return 0;
    });
    logger.info(`[${id}] ファイル一覧 \n ${JSON.stringify(fileInfoList, null, '  ')}`);
    fileInfoList.pop();

    // 残りをS3にアップロード
    let isUploaded = false;
    for (const file of fileInfoList) {
      const basefile = file.filePath;
      let tofile: string;
      const lockFile = `./data/${path.basename(basefile)}.lock`;
      if (isFilenameChange) {
        // Twitchから取得したタイトル
        try {
          const twitchText = await readFileText('./data/twitch.csv', 'utf-8');
          if (!twitchText) throw '';
          tofile = twitchText + '_' + converDateToStr(new Date()) + config.watch.ext;
          logger.info(`[${id}] ${tofile}`);
        } catch (e) {
          // ファイルが無かったり読めなかったり
          tofile = path.basename(basefile);
        }
      } else {
        tofile = path.basename(basefile);
      }
      logger.info(`[${id}] check lock ${lockFile}`);
      if (await isFileExist(lockFile)) {
        logger.info(`[${id}] ${tofile} はアップロード中だった`);
        continue;
      }
      await writeTextFile(lockFile, `${new Date()}`);
      await sendDiscord(`S3アップロード開始: ${tofile}`);
      isUploaded = true;
      await s3mv(config.aws.bucket, config.aws.dir, basefile, tofile, config.aws.storageClass);
      try {
        await removeFile(lockFile);
      } catch (e) {
        logger.error(`[${id}] 何でか${tofile}を消せなかった`);
      }
      await sendDiscord(`S3アップロード完了: ${tofile}`);
    }

    // Twitchからタイトルを取得してファイルに書き込み
    if (isUploaded) {
      const nexttitle = await getAndWriteTwitchTitle();
      await sendDiscord(`次のアップロード予定タイトルは ${nexttitle}`);
    } else {
      logger.info(`[${id}] このチェックではアップロード対象無し`);
    }
  } catch (e) {
    const message = `[${id}] [ERROR] ${JSON.stringify(e, null, '  ')}`;
    logger.error(message);
    sendDiscord(message);
  }
};
