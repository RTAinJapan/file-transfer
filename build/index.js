"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var check_1 = require("./check");
var config_1 = __importDefault(require("config"));
var config = config_1.default.util.toObject(config_1.default);
// 環境チェック
check_1.checkEnv().then(function () {
    // 起動時にも実行
    check_1.checkAndMoveFile();
    // 定期チェック
    setInterval(function () {
        check_1.checkAndMoveFile();
    }, config.watch.checkInterval * 60 * 1000);
    // 生存チェック
    setInterval(function () {
        check_1.discordWebSocketHeartbeat();
    }, 30 * 60 * 1000);
});
