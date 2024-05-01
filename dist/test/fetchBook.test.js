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
const mongoose_1 = __importDefault(require("mongoose"));
const connect_mongo_1 = require("../utils/connect.mongo");
const constants_1 = require("../utils/constants");
const dao_service_1 = require("../services/dao.service");
const author_1 = require("../models/author");
const book_1 = require("../models/book");
const get_book_1 = require("../services/get.book");
describe("Fetched book details along with author info", () => {
    const authorData = {
        _id: new mongoose_1.default.Types.ObjectId(),
        name: 'Test Author'
    };
    const bookData1 = {
        _id: new mongoose_1.default.Types.ObjectId(),
        title: 'Test Author Book 1',
        authorId: authorData._id
    };
    const bookData2 = {
        _id: new mongoose_1.default.Types.ObjectId(),
        title: 'Test Author Book 2',
        authorId: authorData._id
    };
    const bookData3 = {
        _id: new mongoose_1.default.Types.ObjectId(),
        title: 'Test Author Book 3',
        authorId: authorData._id
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connect_mongo_1.connectMongoose)(constants_1.CONSTANTS.MONGO_URL);
        yield book_1.Book.deleteMany({});
        yield author_1.Author.deleteMany({});
        yield (0, dao_service_1.createRecord)(authorData, 'author');
        yield (0, dao_service_1.createRecord)(bookData1, 'book');
        yield (0, dao_service_1.createRecord)(bookData2, 'book');
        yield (0, dao_service_1.createRecord)(bookData3, 'book');
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connect_mongo_1.disConnectMongoose)();
    }));
    it("Validating getBook() response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, get_book_1.getBook)(bookData2._id);
        console.log(JSON.stringify(response)
            .replace(/,/g, ',\n')
            .replace(/({|})/g, '$1\n'));
        expect(response).toHaveProperty("authorDetails");
        expect(response).toHaveProperty("bookDetails");
        expect(response).toHaveProperty('otherBooksByAuthor');
        const { authorDetails, bookDetails, otherBooksByAuthor } = response;
        expect(authorDetails).toHaveProperty('_id', authorData._id);
        expect(authorDetails).toHaveProperty('name', authorData.name);
        expect(authorDetails).toHaveProperty('booksCount', 3);
        expect(bookDetails).toHaveProperty('title', bookData2.title);
        expect(bookDetails).toHaveProperty('authorId', authorData._id);
        expect(bookDetails).toHaveProperty('addedOn');
        expect(otherBooksByAuthor.length).toBe(2);
        expect(otherBooksByAuthor[0]).toHaveProperty('_id', bookData1._id);
        expect(otherBooksByAuthor[0]).toHaveProperty('title', bookData1.title);
        expect(otherBooksByAuthor[1]).toHaveProperty('_id', bookData3._id);
        expect(otherBooksByAuthor[1]).toHaveProperty('title', bookData3.title);
    }));
});
