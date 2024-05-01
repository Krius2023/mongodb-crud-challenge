import { Author } from "../models/author";

export const getAuthor = async (authorId: any) => {
    try {
        const response = await Author.aggregate([
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
    } catch (e) {
        console.error('Error while getting a book:: ', e);
        throw e;
    }
};