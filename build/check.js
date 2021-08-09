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
                fixedTitle = title.replace('/', '').replace('|', '').trim();
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
    var files, fileInfoList, _i, files_1, file, info, isFilenameChange, _a, fileInfoList_1, file, basefile, tofile, twitchText, e_4, nexttitle, e_5, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 21, , 22]);
                return [4 /*yield*/, util_1.find(config.watch.targetDir + "\\*" + config.watch.ext)];
            case 1:
                files = _b.sent();
                fileInfoList = [];
                _i = 0, files_1 = files;
                _b.label = 2;
            case 2:
                if (!(_i < files_1.length)) return [3 /*break*/, 5];
                file = files_1[_i];
                return [4 /*yield*/, util_1.statFile(file)];
            case 3:
                info = _b.sent();
                fileInfoList.push({
                    filePath: file,
                    createDate: info.birthtime,
                });
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                if (fileInfoList.length < 2) {
                    logger_1.default.console.info('ファイル数が既定数以下なので終了');
                    return [2 /*return*/];
                }
                isFilenameChange = fileInfoList.length === 2;
                if (!!isFilenameChange) return [3 /*break*/, 7];
                return [4 /*yield*/, sendDiscord('何らかの理由でファイルが3つ以上あるため、ファイル名変換は行わずにアップロードします')];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                // ソートして一番新しいものを除外
                fileInfoList = fileInfoList.sort(function (a, b) {
                    if (a.createDate > b.createDate)
                        return 1;
                    if (a.createDate < b.createDate)
                        return -1;
                    return 0;
                });
                logger_1.default.console.info(JSON.stringify(fileInfoList, null, '  '));
                fileInfoList.pop();
                _a = 0, fileInfoList_1 = fileInfoList;
                _b.label = 8;
            case 8:
                if (!(_a < fileInfoList_1.length)) return [3 /*break*/, 18];
                file = fileInfoList_1[_a];
                basefile = file.filePath;
                tofile = void 0;
                if (!isFilenameChange) return [3 /*break*/, 13];
                _b.label = 9;
            case 9:
                _b.trys.push([9, 11, , 12]);
                return [4 /*yield*/, util_1.readFileText('./data/twitch.csv', 'utf-8')];
            case 10:
                twitchText = _b.sent();
                if (!twitchText)
                    throw '';
                tofile = twitchText + '_' + util_1.converDateToStr(new Date()) + config.watch.ext;
                logger_1.default.console.info(tofile);
                return [3 /*break*/, 12];
            case 11:
                e_4 = _b.sent();
                // ファイルが無かったり読めなかったり
                tofile = path_1.default.basename(basefile);
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13:
                tofile = path_1.default.basename(basefile);
                _b.label = 14;
            case 14: return [4 /*yield*/, util_1.s3mv(config.aws.bucket, config.aws.dir, basefile, tofile)];
            case 15:
                _b.sent();
                return [4 /*yield*/, sendDiscord("S3\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5B8C\u4E86: " + tofile)];
            case 16:
                _b.sent();
                _b.label = 17;
            case 17:
                _a++;
                return [3 /*break*/, 8];
            case 18: return [4 /*yield*/, getAndWriteTwitchTitle()];
            case 19:
                nexttitle = _b.sent();
                return [4 /*yield*/, sendDiscord("\u6B21\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u4E88\u5B9A\u30BF\u30A4\u30C8\u30EB\u306F " + nexttitle)];
            case 20:
                _b.sent();
                return [3 /*break*/, 22];
            case 21:
                e_5 = _b.sent();
                message = "[ERROR] " + JSON.stringify(e_5, null, '  ');
                logger_1.default.system.error(message);
                sendDiscord(message);
                return [3 /*break*/, 22];
            case 22: return [2 /*return*/];
        }
    });
}); };
exports.checkAndMoveFile = checkAndMoveFile;
