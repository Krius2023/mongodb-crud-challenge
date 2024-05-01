import mongoose from "mongoose";
import { connectMongoose, disConnectMongoose } from "../utils/connect.mongo";
import { CONSTANTS } from "../utils/constants";
import { createRecord } from "../services/dao.service";
import { Author } from "../models/author";
import { Book } from "../models/book";
import { getAuthor } from "../services/get.author";


describe("Fetched author details along with their book details", () => {
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

    it("Validating getAuthor() response", async () => {
        const response = await getAuthor(authorData._id);
        console.log(
            JSON.stringify(response)
                .replace(/,/g, ',\n')
                .replace(/({|})/g, '$1\n')
        );
        expect(1).toBe(1);
        expect(response).toHaveProperty("authorDetails");
        expect(response).toHaveProperty("booksByAuthor");

        const { authorDetails, booksByAuthor } = response;

        expect(authorDetails).toHaveProperty('authorId', authorData._id);
        expect(authorDetails).toHaveProperty('name', authorData.name);
        expect(authorDetails).toHaveProperty('booksCount', 3);

        expect(booksByAuthor.length).toBe(3);
        expect(booksByAuthor[0]).toHaveProperty('_id', bookData1._id);
        expect(booksByAuthor[0]).toHaveProperty('title', bookData1.title);
        expect(booksByAuthor[0]).toHaveProperty('addedOn');

        expect(booksByAuthor[1]).toHaveProperty('_id', bookData2._id);
        expect(booksByAuthor[1]).toHaveProperty('title', bookData2.title);
        expect(booksByAuthor[1]).toHaveProperty('addedOn');

        expect(booksByAuthor[2]).toHaveProperty('_id', bookData3._id);
        expect(booksByAuthor[2]).toHaveProperty('title', bookData3.title);
        expect(booksByAuthor[2]).toHaveProperty('addedOn');
    });
});