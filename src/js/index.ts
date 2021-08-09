import { checkAndMoveFile, checkEnv, discordWebSocketHeartbeat } from './check';

// 環境チェック
checkEnv().then(() => {
  // 起動時にも実行
  checkAndMoveFile();

  // 定期チェック
  setInterval(() => {
    checkAndMoveFile();
  }, 5 * 60 * 1000);

  // 生存チェック
  setInterval(() => {
    discordWebSocketHeartbeat();
  }, 30 * 60 * 1000);
});
