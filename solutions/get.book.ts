import { Book } from "../models/book";

export const getBook = async (bookId: any) => {
    try {
        const response = await Book.aggregate([
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
    } catch (e) {
        console.error('Error while getting a book:: ', e);
        throw e;
    }
};