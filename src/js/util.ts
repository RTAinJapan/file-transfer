import fs from 'fs-extra';
import logger from './logger';
import glob from 'glob';
import { exec } from 'child_process';
import Encoding from 'encoding-japanese';
import { stat, Stats } from 'fs-extra';

/**
 * Dateオブジェクトを、YYYYMMDD_HHMM形式にする
 * @param date
 * @returns YYYYMMDD_HHMM
 */
export const converDateToStr = (date: Date): string => {
  const year = `0000${date.getFullYear()}`.slice(-4);
  const month = `00${date.getMonth() + 1}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  const hour = `00${date.getHours()}`.slice(-2);
  const minute = `00${date.getMinutes()}`.slice(-2);
  return `${year}${month}${day}_${hour}${minute}`;
};

/**
 * awaitで囲いたいfs.exists
 * @param fullPath ファイルの絶対パス
 * @return true:存在する false:しない
 */
export const isFileExist = (fullPath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.exists(fullPath, (exists: boolean) => {
      resolve(exists);
    });
  });
};

/**
 * awaitで囲いたいreadFile
 * @param filePath ファイルのパス
 * @param code 文字コード
 * @return 読み込んだ文字列
 */
export const readFileText = (filePath: string, code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, code, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

/**
 * awaitで囲いたいremove
 * @param src 削除対象のファイルのパス
 * @throws 削除で何かあった
 */
export const removeFile = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.remove(src, (err) => {
      if (err) reject();
      resolve();
    });
  });
};

/**
 * テキストファイルに上書き保存
 * @param filepath ファイルパス
 * @param dataStr 文字
 */
export const writeTextFile = async (filepath: string, dataStr: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, dataStr, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

/**
 * ファイル情報を取得
 * @param pattern 検索パターン
 */
export const statFile = (filefullPath: string): Promise<Stats> => {
  return new Promise((resolve, reject) => {
    stat(filefullPath, (err: any, stats: Stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });
};

/**
 * globでファイル検索
 * @param pattern 検索パターン
 */
export const find = (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(pattern, (err: any, files: string[]) => {
      if (err) reject(err);
      resolve(files);
    });
  });
};

/**
 * リトライするやつ
 * @param func
 */
export const retry = async <T>(func: any): Promise<T> => {
  for (let i = 0; i < 3; i++) {
    try {
      return (await func()) as T;
    } catch (e) {
      if (i === 2) throw e;
    }
  }
  throw new Error('エラーになってないけど成功もしなかった');
};

/**
 * スリーブ
 * @param msec スリーブするミリ秒
 */
export const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec));

export const execCommand = (command: string): Promise<string> => {
  logger.console.debug(`[execCommand] ${command}`);
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'buffer', maxBuffer: 1024 * 5000 }, (error, stdout, strerr) => {
      const toString = (bytes: Buffer) => {
        return Encoding.convert(bytes, {
          from: 'SJIS',
          to: 'UNICODE',
          type: 'string',
        });
      };

      if (error) {
        logger.system.error(`[execCommand] error ${JSON.stringify(error)}`);
      }

      if (error || toString(strerr)) {
        logger.console.error(`[execCommand] strerr`);
        reject(toString(strerr));
      }

      resolve(toString(stdout));
    });
  });
};

/**
 * GLACIERでS3にアップロード
 * @param bucket バケット名
 * @param dir ディレクトリ
 * @param from アップロード元のファイルのフルパス
 * @param to アップロード先のファイル名
 */
export const s3mv = async (bucket: string, dir: string, from: string, to: string, storageClass: string): Promise<void> => {
  const storageClass2 = storageClass ? storageClass : 'STANDARD';
  const command = `aws s3 mv "${from}" "s3://${bucket}/${dir}/${to}" --storage-class ${storageClass2} --quiet`;
  logger.system.info(`[s3mv] ${command}`);
  const result = await execCommand(command);
  logger.system.info(result);
};
