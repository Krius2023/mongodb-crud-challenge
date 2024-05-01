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
const book_1 = require("../models/book");
const mongoose_1 = __importDefault(require("mongoose"));
const dao_service_1 = require("../services/dao.service");
const author_1 = require("../models/author");
describe('Testing MongoDB Utils', () => {
    const authorId1 = new mongoose_1.default.Types.ObjectId();
    const authorId2 = new mongoose_1.default.Types.ObjectId();
    const authorData1 = {
        _id: authorId1,
        name: 'author1'
    };
    const authorData2 = {
        _id: authorId2,
        name: 'author2'
    };
    const bookId = new mongoose_1.default.Types.ObjectId();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connect_mongo_1.connectMongoose)(constants_1.CONSTANTS.MONGO_URL);
        yield book_1.Book.deleteMany({});
        yield author_1.Author.deleteMany({});
        yield (0, dao_service_1.createRecord)(authorData1, 'author');
        yield (0, dao_service_1.createRecord)(authorData2, 'author');
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connect_mongo_1.disConnectMongoose)();
    }));
    const bookData = {
        _id: bookId,
        title: 'Book title 1',
        authorId: authorData1._id
    };
    it('Should create a new book record', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        yield (0, dao_service_1.createRecord)(bookData, 'book');
        const createdBook = yield book_1.Book.findById(bookId);
        expect((_a = createdBook === null || createdBook === void 0 ? void 0 : createdBook._id) === null || _a === void 0 ? void 0 : _a.toString()).toBe(bookData._id.toString());
        expect(createdBook === null || createdBook === void 0 ? void 0 : createdBook.title).toBe(bookData.title);
        expect((_b = createdBook === null || createdBook === void 0 ? void 0 : createdBook.authorId) === null || _b === void 0 ? void 0 : _b.toString()).toBe(authorData1._id.toString());
    }));
    it('Should update the author\'s books count for the new book', () => __awaiter(void 0, void 0, void 0, function* () {
        const respectiveAuthorData = yield author_1.Author.findById(authorData1._id);
        expect(respectiveAuthorData === null || respectiveAuthorData === void 0 ? void 0 : respectiveAuthorData.booksCount).toBe(1);
    }));
    it('Should throw error for existing book', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(() => (0, dao_service_1.createRecord)(bookData, 'book')).rejects.toThrowError('Book already exists');
    }));
    it('Should throw error for invalid authorId', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidAuthorId = new mongoose_1.default.Types.ObjectId();
        const invalidBookData = {
            bookId: new mongoose_1.default.Types.ObjectId(),
            title: 'Book title ' + Math.floor(Math.random() * 100),
            authorId: invalidAuthorId
        };
        yield expect(() => (0, dao_service_1.createRecord)(invalidBookData, 'book')).rejects.toThrowError('Author not found');
        const createdTestBook = yield book_1.Book.findById(invalidBookData.bookId);
        expect(createdTestBook).toBeNull();
    }));
    it('Should update a book record and authors booksCount', () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const authorData3 = {
            _id: new mongoose_1.default.Types.ObjectId(),
            name: 'author3'
        };
        yield (0, dao_service_1.createRecord)(authorData3, 'author');
        const authorData4 = {
            _id: new mongoose_1.default.Types.ObjectId(),
            name: 'author4'
        };
        yield (0, dao_service_1.createRecord)(authorData4, 'author');
        const bookData = {
            _id: new mongoose_1.default.Types.ObjectId(),
            title: 'Book title 2',
            authorId: authorData3._id
        };
        yield (0, dao_service_1.createRecord)(bookData, 'book');
        const fieldsToUpdate = {
            title: 'title updated',
            authorId: authorData4._id
        };
        yield (0, dao_service_1.updateRecord)(bookData._id, fieldsToUpdate);
        const foundBook = yield book_1.Book.findById(bookData._id);
        expect(foundBook === null || foundBook === void 0 ? void 0 : foundBook.title).toBe(fieldsToUpdate.title);
        expect((_c = foundBook === null || foundBook === void 0 ? void 0 : foundBook.authorId) === null || _c === void 0 ? void 0 : _c.toString()).toBe(authorData4._id.toString());
        const oldAuthor = yield author_1.Author.findById(authorData3._id);
        expect(oldAuthor === null || oldAuthor === void 0 ? void 0 : oldAuthor.booksCount).toBe(0);
        const newAuthor = yield author_1.Author.findById(authorData4._id);
        expect(newAuthor === null || newAuthor === void 0 ? void 0 : newAuthor.booksCount).toBe(1);
    }));
    it('Should throw error when updating a book with invalid authorId', () => __awaiter(void 0, void 0, void 0, function* () {
        const fieldsToUpdate = {
            title: 'title updated',
            authorId: new mongoose_1.default.Types.ObjectId()
        };
        yield expect(() => (0, dao_service_1.updateRecord)(bookData._id, fieldsToUpdate)).rejects.toThrowError('Author not found');
    }));
    it('Should delete a document', () => __awaiter(void 0, void 0, void 0, function* () {
        const newBookData = {
            _id: new mongoose_1.default.Types.ObjectId(),
            title: 'Book title 5',
            authorId: authorData2._id
        };
        yield (0, dao_service_1.createRecord)(newBookData, 'book');
        yield (0, dao_service_1.deleteRecord)(newBookData._id);
        const foundBook = yield book_1.Book.findById(newBookData._id);
        expect(foundBook).toBeNull();
        const author = yield author_1.Author.findById(authorData2._id);
        expect(author === null || author === void 0 ? void 0 : author.booksCount).toBe(0);
    }));
});
