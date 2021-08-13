/** Config */
interface Config {
  /** Discordの設定 */
  discord: {
    /** WebHook通知先URL。空の場合は通知しない */
    webhook: string;
  };
  watch: {
    /**
     * 監視対象のディレクトリ
     * @example "C:\\Users\\pasta04\\Desktop\\rec"
     */
    targetDir: string;
    /** 監視間隔(分) */
    checkInterval: number;
    /** 拡張子 */
    ext: string;
  };
  aws: {
    /** S3バケット名 */
    bucket: string;
    /**
     * S3ディレクトリ名
     * @example 2021-summer
     */
    dir: string;
    /** ストレージクラス */
    storageClass: string;
  };
  twitch: {
    ClientId: string;
  };
  /** ログの設定 */
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
