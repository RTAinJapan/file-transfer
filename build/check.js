"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndMoveFile = exports.discordWebSocketHeartbeat = exports.checkEnv = void 0;
var logger_1 = __importDefault(require("./logger"));
var config_1 = __importDefault(require("config"));
var util_1 = require("./util");
var axios_1 = __importDefault(require("axios"));
var path_1 = __importDefault(require("path"));
var config = config_1.default.util.toObject(config_1.default);
var checkEnv = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ret, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                // AWS CLIでS3のチェック
                logger_1.default.system.info('[checkEnv] AWS S3');
                return [4 /*yield*/, util_1.execCommand("aws s3 ls s3://" + config.aws.bucket + "/" + config.aws.dir + "/")];
            case 1:
                ret = _a.sent();
                logger_1.default.system.info(ret);
                // 監視対象のチェック
                logger_1.default.system.info('[checkEnv] 監視対象のディレクトリ');
                return [4 /*yield*/, util_1.execCommand("cd " + config.watch.targetDir + " & dir /B")];
            case 2:
                ret = _a.sent();
                logger_1.default.system.info(ret);
                // WebHookのチェック
                logger_1.default.system.info('[checkEnv] Discord WebHook');
                ret = exports.discordWebSocketHeartbeat();
                logger_1.default.system.info(JSON.stringify(ret));
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                logger_1.default.system.error(JSON.stringify(e_1));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.checkEnv = checkEnv;
var sendDiscord = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var url, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = config.discord.webhook;
                if (!url)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(url, {
                        content: message,
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                logger_1.default.system.error(e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var discordWebSocketHeartbeat = function () {
    return sendDiscord('ファイル転送監視は動作しています');
};
exports.discordWebSocketHeartbeat = discordWebSocketHeartbeat;
var getAndWriteTwitchTitle = function () { return __awaiter(void 0, void 0, void 0, function () {
    var title, fixedTitle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getTwitchTitle()];
            case 1:
                title = _a.sent();
                if (!title)
                    return [2 /*return*/, ''];
                fixedTitle = title.replace('/', '').replace('|', '').replace('\\', '').replace(':', ' -').trim();
                return [4 /*yield*/, util_1.writeTextFile('./data/twitch.csv', fixedTitle)];
            case 2:
                _a.sent();
                return [2 /*return*/, fixedTitle];
        }
    });
}); };
var getTwitchTitle = function () { return __awaiter(void 0, void 0, void 0, function () {
    var headers, body, response, jsonList, title, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                headers = {
                    'Client-Id': config.twitch.ClientId,
                };
                body = [
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
                return [4 /*yield*/, axios_1.default.post('https://gql.twitch.tv/gql', body, { headers: headers })];
            case 1:
                response = _a.sent();
                jsonList = response.data;
                if (jsonList.length === 0)
                    return [2 /*return*/, ''];
                title = jsonList[0].data.user.broadcastSettings.title;
                return [2 /*return*/, title];
            case 2:
                e_3 = _a.sent();
                return [2 /*return*/, ''];
            case 3: return [2 /*return*/];
        }
    });
}); };
var checkAndMoveFile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var id, files, fileInfoList, _i, files_1, file, info, isFilenameChange, isUploaded, _a, fileInfoList_1, file, basefile, tofile, lockFile, twitchText, e_4, e_5, nexttitle, e_6, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = "" + new Date().getTime();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 31, , 32]);
                return [4 /*yield*/, util_1.find(config.watch.targetDir + "\\*" + config.watch.ext)];
            case 2:
                files = _b.sent();
                fileInfoList = [];
                _i = 0, files_1 = files;
                _b.label = 3;
            case 3:
                if (!(_i < files_1.length)) return [3 /*break*/, 6];
                file = files_1[_i];
                return [4 /*yield*/, util_1.statFile(file)];
            case 4:
                info = _b.sent();
                fileInfoList.push({
                    filePath: file,
                    createDate: info.birthtime,
                });
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                if (fileInfoList.length < 2) {
                    logger_1.default.console.info("[" + id + "] \u30D5\u30A1\u30A4\u30EB\u6570\u304C\u65E2\u5B9A\u6570\u4EE5\u4E0B\u306A\u306E\u3067\u7D42\u4E86");
                    return [2 /*return*/];
                }
                isFilenameChange = fileInfoList.length === 2;
                if (!!isFilenameChange) return [3 /*break*/, 8];
                return [4 /*yield*/, sendDiscord('何らかの理由でファイルが3つ以上あるため、ファイル名変換は行わずにアップロードします')];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                // ソートして一番新しいものを除外
                fileInfoList = fileInfoList.sort(function (a, b) {
                    if (a.createDate > b.createDate)
                        return 1;
                    if (a.createDate < b.createDate)
                        return -1;
                    return 0;
                });
                logger_1.default.console.info("[" + id + "] \u30D5\u30A1\u30A4\u30EB\u4E00\u89A7 \n " + JSON.stringify(fileInfoList, null, '  '));
                fileInfoList.pop();
                isUploaded = false;
                _a = 0, fileInfoList_1 = fileInfoList;
                _b.label = 9;
            case 9:
                if (!(_a < fileInfoList_1.length)) return [3 /*break*/, 26];
                file = fileInfoList_1[_a];
                basefile = file.filePath;
                tofile = void 0;
                lockFile = "./data/" + path_1.default.basename(basefile) + ".lock";
                if (!isFilenameChange) return [3 /*break*/, 14];
                _b.label = 10;
            case 10:
                _b.trys.push([10, 12, , 13]);
                return [4 /*yield*/, util_1.readFileText('./data/twitch.csv', 'utf-8')];
            case 11:
                twitchText = _b.sent();
                if (!twitchText)
                    throw '';
                tofile = twitchText + '_' + util_1.converDateToStr(new Date()) + config.watch.ext;
                logger_1.default.console.info("[" + id + "] " + tofile);
                return [3 /*break*/, 13];
            case 12:
                e_4 = _b.sent();
                // ファイルが無かったり読めなかったり
                tofile = path_1.default.basename(basefile);
                return [3 /*break*/, 13];
            case 13: return [3 /*break*/, 15];
            case 14:
                tofile = path_1.default.basename(basefile);
                _b.label = 15;
            case 15:
                logger_1.default.system.info("[" + id + "] check lock " + lockFile);
                return [4 /*yield*/, util_1.isFileExist(lockFile)];
            case 16:
                if (_b.sent()) {
                    logger_1.default.system.info("[" + id + "] " + tofile + " \u306F\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u4E2D\u3060\u3063\u305F");
                    return [3 /*break*/, 25];
                }
                return [4 /*yield*/, util_1.writeTextFile(lockFile, "" + new Date())];
            case 17:
                _b.sent();
                return [4 /*yield*/, sendDiscord("S3\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u958B\u59CB: " + tofile)];
            case 18:
                _b.sent();
                isUploaded = true;
                return [4 /*yield*/, util_1.s3mv(config.aws.bucket, config.aws.dir, basefile, tofile)];
            case 19:
                _b.sent();
                _b.label = 20;
            case 20:
                _b.trys.push([20, 22, , 23]);
                return [4 /*yield*/, util_1.removeFile(lockFile)];
            case 21:
                _b.sent();
                return [3 /*break*/, 23];
            case 22:
                e_5 = _b.sent();
                logger_1.default.system.error("[" + id + "] \u4F55\u3067\u304B" + tofile + "\u3092\u6D88\u305B\u306A\u304B\u3063\u305F");
                return [3 /*break*/, 23];
            case 23: return [4 /*yield*/, sendDiscord("S3\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5B8C\u4E86: " + tofile)];
            case 24:
                _b.sent();
                _b.label = 25;
            case 25:
                _a++;
                return [3 /*break*/, 9];
            case 26:
                if (!isUploaded) return [3 /*break*/, 29];
                return [4 /*yield*/, getAndWriteTwitchTitle()];
            case 27:
                nexttitle = _b.sent();
                return [4 /*yield*/, sendDiscord("\u6B21\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u4E88\u5B9A\u30BF\u30A4\u30C8\u30EB\u306F " + nexttitle)];
            case 28:
                _b.sent();
                return [3 /*break*/, 30];
            case 29:
                logger_1.default.system.info("[" + id + "] \u3053\u306E\u30C1\u30A7\u30C3\u30AF\u3067\u306F\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5BFE\u8C61\u7121\u3057");
                _b.label = 30;
            case 30: return [3 /*break*/, 32];
            case 31:
                e_6 = _b.sent();
                message = "[" + id + "] [ERROR] " + JSON.stringify(e_6, null, '  ');
                logger_1.default.system.error(message);
                sendDiscord(message);
                return [3 /*break*/, 32];
            case 32: return [2 /*return*/];
        }
    });
}); };
exports.checkAndMoveFile = checkAndMoveFile;
