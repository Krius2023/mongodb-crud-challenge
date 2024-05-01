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
exports.getBook = void 0;
const book_1 = require("../models/book");
const getBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield book_1.Book.aggregate([
            {
                $match: { _id: bookId }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "authorDetails"
                }
            },
            {
                $unwind: "$authorDetails"
            },
            {
                $lookup: {
                    from: "books",
                    localField: "authorDetails._id",
                    foreignField: "authorId",
                    as: "otherBooksByAuthor"
                }
            },
            {
                $addFields: {
                    otherBooksByAuthor: {
                        $filter: {
                            input: "$otherBooksByAuthor",
                            as: "book",
                            cond: { $and: [{ $ne: ["$$book._id", "$_id"] }] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    bookDetails: {
                        title: "$title",
                        authorId: "$authorId",
                        addedOn: "$addedOn"
                    },
                    authorDetails: {
                        _id: "$authorDetails._id",
                        name: "$authorDetails.name",
                        booksCount: "$authorDetails.booksCount"
                    },
                    otherBooksByAuthor: {
                        $map: {
                            input: "$otherBooksByAuthor",
                            as: "book",
                            in: {
                                _id: "$$book._id",
                                title: "$$book.title"
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
exports.getBook = getBook;
