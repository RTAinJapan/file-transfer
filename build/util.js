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
exports.s3mv = exports.execCommand = exports.sleep = exports.retry = exports.find = exports.statFile = exports.writeTextFile = exports.removeFile = exports.readFileText = exports.isFileExist = exports.converDateToStr = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var logger_1 = __importDefault(require("./logger"));
var glob_1 = __importDefault(require("glob"));
var child_process_1 = require("child_process");
var encoding_japanese_1 = __importDefault(require("encoding-japanese"));
var fs_extra_2 = require("fs-extra");
/**
 * Dateオブジェクトを、YYYYMMDD_HHMM形式にする
 * @param date
 * @returns YYYYMMDD_HHMM
 */
var converDateToStr = function (date) {
    var year = ("0000" + date.getFullYear()).slice(-4);
    var month = ("00" + (date.getMonth() + 1)).slice(-2);
    var day = ("00" + date.getDate()).slice(-2);
    var hour = ("00" + date.getHours()).slice(-2);
    var minute = ("00" + date.getMinutes()).slice(-2);
    return "" + year + month + day + "_" + hour + minute;
};
exports.converDateToStr = converDateToStr;
/**
 * awaitで囲いたいfs.exists
 * @param fullPath ファイルの絶対パス
 * @return true:存在する false:しない
 */
var isFileExist = function (fullPath) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.default.exists(fullPath, function (exists) {
            resolve(exists);
        });
    });
};
exports.isFileExist = isFileExist;
/**
 * awaitで囲いたいreadFile
 * @param filePath ファイルのパス
 * @param code 文字コード
 * @return 読み込んだ文字列
 */
var readFileText = function (filePath, code) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.default.readFile(filePath, code, function (err, data) {
            if (err)
                reject(err);
            resolve(data);
        });
    });
};
exports.readFileText = readFileText;
/**
 * awaitで囲いたいremove
 * @param src 削除対象のファイルのパス
 * @throws 削除で何かあった
 */
var removeFile = function (src) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.default.remove(src, function (err) {
            if (err)
                reject();
            resolve();
        });
    });
};
exports.removeFile = removeFile;
/**
 * テキストファイルに上書き保存
 * @param filepath ファイルパス
 * @param dataStr 文字
 */
var writeTextFile = function (filepath, dataStr) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                fs_extra_1.default.writeFile(filepath, dataStr, function (err) {
                    if (err)
                        reject(err);
                    resolve();
                });
            })];
    });
}); };
exports.writeTextFile = writeTextFile;
/**
 * ファイル情報を取得
 * @param pattern 検索パターン
 */
var statFile = function (filefullPath) {
    return new Promise(function (resolve, reject) {
        fs_extra_2.stat(filefullPath, function (err, stats) {
            if (err)
                reject(err);
            resolve(stats);
        });
    });
};
exports.statFile = statFile;
/**
 * globでファイル検索
 * @param pattern 検索パターン
 */
var find = function (pattern) {
    return new Promise(function (resolve, reject) {
        glob_1.default(pattern, function (err, files) {
            if (err)
                reject(err);
            resolve(files);
        });
    });
};
exports.find = find;
/**
 * リトライするやつ
 * @param func
 */
var retry = function (func) { return __awaiter(void 0, void 0, void 0, function () {
    var i, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < 3)) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, func()];
            case 3: return [2 /*return*/, (_a.sent())];
            case 4:
                e_1 = _a.sent();
                if (i === 2)
                    throw e_1;
                return [3 /*break*/, 5];
            case 5:
                i++;
                return [3 /*break*/, 1];
            case 6: throw new Error('エラーになってないけど成功もしなかった');
        }
    });
}); };
exports.retry = retry;
/**
 * スリーブ
 * @param msec スリーブするミリ秒
 */
var sleep = function (msec) { return new Promise(function (resolve) { return setTimeout(resolve, msec); }); };
exports.sleep = sleep;
var execCommand = function (command) {
    logger_1.default.debug("[execCommand] " + command);
    return new Promise(function (resolve, reject) {
        child_process_1.exec(command, { encoding: 'buffer', maxBuffer: 1024 * 5000 }, function (error, stdout, strerr) {
            var toString = function (bytes) {
                return encoding_japanese_1.default.convert(bytes, {
                    from: 'SJIS',
                    to: 'UNICODE',
                    type: 'string',
                });
            };
            if (error) {
                logger_1.default.error("[execCommand] error " + JSON.stringify(error));
            }
            if (error || toString(strerr)) {
                logger_1.default.error("[execCommand] strerr");
                reject(toString(strerr));
            }
            resolve(toString(stdout));
        });
    });
};
exports.execCommand = execCommand;
/**
 * GLACIERでS3にアップロード
 * @param bucket バケット名
 * @param dir ディレクトリ
 * @param from アップロード元のファイルのフルパス
 * @param to アップロード先のファイル名
 */
var s3mv = function (bucket, dir, from, to, storageClass) { return __awaiter(void 0, void 0, void 0, function () {
    var storageClass2, command, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                storageClass2 = storageClass ? storageClass : 'STANDARD';
                command = "aws s3 mv \"" + from + "\" \"s3://" + bucket + "/" + dir + "/" + to + "\" --storage-class " + storageClass2 + " --quiet";
                logger_1.default.info("[s3mv] " + command);
                return [4 /*yield*/, exports.execCommand(command)];
            case 1:
                result = _a.sent();
                logger_1.default.info(result);
                return [2 /*return*/];
        }
    });
}); };
exports.s3mv = s3mv;
