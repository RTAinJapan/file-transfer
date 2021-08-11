import { checkAndMoveFile, checkEnv, discordWebSocketHeartbeat } from './check';
import configModule from 'config';
const config: Config = configModule.util.toObject(configModule);

// 環境チェック
checkEnv().then(() => {
  // 起動時にも実行
  checkAndMoveFile();

  // 定期チェック
  setInterval(() => {
    checkAndMoveFile();
  }, config.watch.checkInterval * 60 * 1000);

  // 生存チェック
  setInterval(() => {
    discordWebSocketHeartbeat();
  }, 30 * 60 * 1000);
});
