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
const connect_mongo_1 = require("../utils/connect.mongo");
const constants_1 = require("../utils/constants");
const mongoose_1 = __importDefault(require("mongoose"));
const dao_service_1 = require("../services/dao.service");
const author_1 = require("../models/author");
describe('Testing Author Utils', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connect_mongo_1.connectMongoose)(constants_1.CONSTANTS.MONGO_URL);
        yield author_1.Author.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connect_mongo_1.disConnectMongoose)();
    }));
    const newAuthorName = 'author name 100';
    it('Should create a new author document with expected fields', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const authorId = new mongoose_1.default.Types.ObjectId().toString();
        const authorData = {
            _id: authorId,
            name: newAuthorName
        };
        yield (0, dao_service_1.createRecord)(authorData, 'author');
        const createdAuthor = yield author_1.Author.findById(authorId);
        expect((_a = createdAuthor === null || createdAuthor === void 0 ? void 0 : createdAuthor._id) === null || _a === void 0 ? void 0 : _a.toString()).toBe(authorData._id);
        expect(createdAuthor === null || createdAuthor === void 0 ? void 0 : createdAuthor.name).toBe(authorData.name);
        expect(createdAuthor === null || createdAuthor === void 0 ? void 0 : createdAuthor.booksCount).toBe(0);
    }));
    it('Should throw error when creating author using the existence author name', () => __awaiter(void 0, void 0, void 0, function* () {
        const authorId = new mongoose_1.default.Types.ObjectId().toString();
        const authorData = {
            _id: authorId,
            name: newAuthorName
        };
        yield expect(() => (0, dao_service_1.createRecord)(authorData, 'author')).rejects.toThrowError('Author name already exists');
        const createdAuthor = yield author_1.Author.findById(authorId);
        expect(createdAuthor).toBeNull();
    }));
});
