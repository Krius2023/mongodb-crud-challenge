import mongoose from "mongoose";
import { connectMongoose, disConnectMongoose } from "../utils/connect.mongo";
import { CONSTANTS } from "../utils/constants";
import { createRecord } from "../services/dao.service";
import { Author } from "../models/author";
import { Book } from "../models/book";
import { getBook } from "../services/get.book";


describe("Fetched book details along with author info", () => {
    const authorData = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test Author'
    };

    const bookData1 = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Test Author Book 1',
        authorId: authorData._id
    };

    const bookData2 = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Test Author Book 2',
        authorId: authorData._id
    };

    const bookData3 = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Test Author Book 3',
        authorId: authorData._id
    };

    beforeAll(async () => {
        await connectMongoose(CONSTANTS.MONGO_URL);
        await Book.deleteMany({});
        await Author.deleteMany({});

        await createRecord(authorData, 'author');
        await createRecord(bookData1, 'book');
        await createRecord(bookData2, 'book');
        await createRecord(bookData3, 'book');
    });

    afterAll(async () => {
        await disConnectMongoose();
    });

    it("Validating getBook() response", async () => {
        const response = await getBook(bookData2._id);
        console.log(
            JSON.stringify(response)
                .replace(/,/g, ',\n')
                .replace(/({|})/g, '$1\n')
        );
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
    });
});