/** Config */
interface Config {
  discord: {
    /** Discord WebHook通知先URL。空の場合は通知しない */
    webhook: string;
  };
  watch: {
    /**
     * 監視対象のディレクトリ
     * @example "C:\\Users\\pasta04\\Desktop\\rec"
     * @example "./rec"
     */
    targetDir: string;
    /** 監視間隔(分) */
    checkInterval: number;
    /**
     * 拡張子
     * @example ".mkv"
     */
    ext: string;
  };
  aws: {
    /**
     * S3バケット名
     * @example "rtainjapan-archives"
     */
    bucket: string;
    /**
     * S3ディレクトリ名
     * @example "2021-summer"
     */
    dir: string;
    /**
     * S3 ストレージクラス
     * @description --storage-classに続く引数。STANDARD/GLACIER
     * @example "STANDARD"
     */
    storageClass: string;
  };
  twitch: {
    /**
     * Twitchアクセス時のClientID
     * @description ブラウザでTwitchを開き、 https://gql.twitch.tv/gql に対するリクエストヘッダから抜き出す
     */
    ClientId: string;
  };
  /** ログ出力設定 */
  log4js: {
    appenders: {
      [logType: string]: {
        type: string;
        filename?: string;
        maxLogSize?: number;
        backups?: number;
      };
    };
    categories: {
      [logType: string]: {
        appenders: string[];
        level: string;
      };
    };
  };
}
