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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecord = exports.updateRecord = exports.createRecord = void 0;
const author_1 = require("../models/author");
const book_1 = require("../models/book");
const createRecord = (dataToSave, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (type == 'author') {
            const currentAuthor = yield author_1.Author.findOne({ name: dataToSave.name });
            if (currentAuthor != null) {
                throw new Error("Author name already exists");
            }
            yield author_1.Author.create(dataToSave);
        }
        if (type == 'book') {
            const currentAuthor = yield author_1.Author.findById(dataToSave.authorId);
            if (currentAuthor === null) {
                throw new Error("Author not found");
            }
            const bookData = yield book_1.Book.findOne({ title: dataToSave.title }, { authorId: dataToSave.authorId });
            if (bookData != null) {
                throw new Error("Book already exists");
            }
            yield book_1.Book.create(dataToSave);
            yield author_1.Author.updateOne({ _id: dataToSave.authorId }, { $inc: { booksCount: 1 } });
        }
    }
    catch (e) {
        console.error('Error while storing the data:: ', dataToSave, e);
        throw e;
    }
});
exports.createRecord = createRecord;
const updateRecord = (id, fieldsToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        let oldAuthorId;
        let newAuthorId;
        const book = yield book_1.Book.findById(id);
        try {
            for (var _d = true, _e = __asyncValues(Object.keys(fieldsToUpdate)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const item = _c;
                if (book[`${item}`] != fieldsToUpdate[`${item}`]) {
                    if (item === 'authorId') {
                        oldAuthorId = book.authorId;
                        newAuthorId = fieldsToUpdate[`${item}`];
                        const currentAuthor = yield author_1.Author.findById(newAuthorId);
                        if (currentAuthor === null) {
                            throw new Error("Author not found");
                        }
                    }
                    book[`${item}`] = fieldsToUpdate[`${item}`];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        ;
        yield book.save();
        yield author_1.Author.updateOne({ _id: newAuthorId }, { $inc: { booksCount: 1 } });
        yield author_1.Author.updateOne({ _id: oldAuthorId }, { $inc: { booksCount: -1 } });
    }
    catch (e) {
        console.error('Error while deleting the data:: ', id, e);
        throw e;
    }
});
exports.updateRecord = updateRecord;
const deleteRecord = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_1.Book.findById(id);
        yield book_1.Book.deleteOne(id);
        yield author_1.Author.updateOne({ _id: book.authorId }, { $inc: { booksCount: -1 } });
    }
    catch (e) {
        console.error('Error while deleting the data:: ', id, e);
        throw e;
    }
});
exports.deleteRecord = deleteRecord;
