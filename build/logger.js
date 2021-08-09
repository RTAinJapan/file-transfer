"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log4js_1 = __importDefault(require("log4js"));
var config_1 = __importDefault(require("config"));
var config = config_1.default.util.toObject(config_1.default);
log4js_1.default.configure(config.log4js);
exports.default = {
    system: log4js_1.default.getLogger('system'),
    access: log4js_1.default.getLogger('access'),
    console: log4js_1.default.getLogger('console'),
};
