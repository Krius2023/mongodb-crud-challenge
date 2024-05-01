import { connectMongoose, disConnectMongoose } from "../utils/connect.mongo";
import { CONSTANTS } from "../utils/constants";
import mongoose from "mongoose";
import { createRecord } from "../services/dao.service";
import { Author } from "../models/author";



describe('Testing Author Utils', () => {
    beforeAll(async () => {
        await connectMongoose(CONSTANTS.MONGO_URL);
        await Author.deleteMany({});
    });

    afterAll(async () => {
        await disConnectMongoose();
    });
    
    const newAuthorName = 'author name 100';
    it('Should create a new author document with expected fields', async () => {
        const authorId = new mongoose.Types.ObjectId().toString();
        const authorData = {
            _id: authorId,
            name: newAuthorName
        };
        await createRecord(authorData, 'author');

        const createdAuthor = await Author.findById(authorId);

        expect(createdAuthor?._id?.toString()).toBe(authorData._id);
        expect(createdAuthor?.name).toBe(authorData.name);
        expect(createdAuthor?.booksCount).toBe(0);
    });

    it('Should throw error when creating author using the existence author name', async () => {
        const authorId = new mongoose.Types.ObjectId().toString();
        const authorData = {
            _id: authorId,
            name: newAuthorName
        };

        await expect(() => createRecord(authorData, 'author')).rejects.toThrowError('Author name already exists');

        const createdAuthor = await Author.findById(authorId);

        expect(createdAuthor).toBeNull();
    });
});