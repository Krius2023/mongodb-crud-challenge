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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthor = void 0;
const author_1 = require("../models/author");
const getAuthor = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield author_1.Author.aggregate([
            {
                $match: { _id: authorId }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "authorId",
                    as: "booksByAuthor"
                }
            },
            {
                $project: {
                    _id: 0,
                    authorDetails: {
                        name: "$name",
                        authorId: "$_id",
                        booksCount: "$booksCount",
                    },
                    booksByAuthor: {
                        $map: {
                            input: "$booksByAuthor",
                            as: "book",
                            in: {
                                _id: "$$book._id",
                                title: "$$book.title",
                                addedOn: "$$book.addedOn",
                            }
                        }
                    }
                }
            }
        ]);
        return response[0];
    }
    catch (e) {
        console.error('Error while getting a book:: ', e);
        throw e;
    }
});
exports.getAuthor = getAuthor;
