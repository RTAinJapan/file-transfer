"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var check_1 = require("./check");
// 環境チェック
check_1.checkEnv().then(function () {
    // 起動時にも実行
    check_1.checkAndMoveFile();
    // 定期チェック
    setInterval(function () {
        check_1.checkAndMoveFile();
    }, 5 * 60 * 1000);
    // 生存チェック
    setInterval(function () {
        check_1.discordWebSocketHeartbeat();
    }, 30 * 60 * 1000);
});
