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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disConnectMongoose = exports.connectMongoose = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongoose = (mongoUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(mongoUrl);
        console.log('MongoDB connected!');
        return conn;
    }
    catch (e) {
        console.error('Error while enabling Mongo DB Connection:: ', e);
        throw e;
    }
});
exports.connectMongoose = connectMongoose;
const disConnectMongoose = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.disconnect();
        yield mongoose_1.default.connection.close();
        console.log('MongoDB disconnected!');
    }
    catch (e) {
        console.error('Error while disabling Mongo DB Connection:: ', e);
        throw e;
    }
});
exports.disConnectMongoose = disConnectMongoose;
