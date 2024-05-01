import { connectMongoose, disConnectMongoose } from "../utils/connect.mongo";
import { CONSTANTS } from "../utils/constants";
import { Book } from "../models/book";
import mongoose from "mongoose";
import { createRecord, deleteRecord, updateRecord } from "../services/dao.service";
import { Author } from "../models/author";


describe('Testing MongoDB Utils', () => {

    const authorId1 = new mongoose.Types.ObjectId();
    const authorId2 = new mongoose.Types.ObjectId();

    const authorData1 = {
        _id: authorId1,
        name: 'author1'
    };
    const authorData2 = {
        _id: authorId2,
        name: 'author2'
    };

    const bookId = new mongoose.Types.ObjectId();

    beforeAll(async () => {
        await connectMongoose(CONSTANTS.MONGO_URL);
        await Book.deleteMany({});
        await Author.deleteMany({});
        await createRecord(authorData1, 'author');
        await createRecord(authorData2, 'author');
    });

    afterAll(async () => {
        await disConnectMongoose();
    });

    const bookData = {
        _id: bookId,
        title: 'Book title 1',
        authorId: authorData1._id
    };

    it('Should create a new book record', async () => {
        await createRecord(bookData, 'book');

        const createdBook = await Book.findById(bookId);

        expect(createdBook?._id?.toString()).toBe(bookData._id.toString());
        expect(createdBook?.title).toBe(bookData.title);
        expect(createdBook?.authorId?.toString()).toBe(authorData1._id.toString());
    });

    it('Should update the author\'s books count for the new book', async () => {
        const respectiveAuthorData = await Author.findById(authorData1._id);
        expect(respectiveAuthorData?.booksCount).toBe(1);
    });

    it('Should throw error for existing book', async () => {
        await expect(() =>
            createRecord(bookData, 'book'
            )).rejects.toThrowError('Book already exists');
    });

    it('Should throw error for invalid authorId', async () => {
        const invalidAuthorId = new mongoose.Types.ObjectId();
        const invalidBookData = {
            bookId: new mongoose.Types.ObjectId(),
            title: 'Book title ' + Math.floor(Math.random() * 100),
            authorId: invalidAuthorId
        };
        await expect(() =>
            createRecord(invalidBookData, 'book'
            )).rejects.toThrowError('Author not found');

        const createdTestBook = await Book.findById(invalidBookData.bookId);
        expect(createdTestBook).toBeNull();
    });

    it('Should update a book record and authors booksCount', async () => {

        const authorData3 = {
            _id: new mongoose.Types.ObjectId(),
            name: 'author3'
        };
        await createRecord(authorData3, 'author');
        const authorData4 = {
            _id: new mongoose.Types.ObjectId(),
            name: 'author4'
        };
        await createRecord(authorData4, 'author');

        const bookData = {
            _id: new mongoose.Types.ObjectId(),
            title: 'Book title 2',
            authorId: authorData3._id
        };
        await createRecord(bookData, 'book');

        const fieldsToUpdate = {
            title: 'title updated',
            authorId: authorData4._id
        };
        await updateRecord(bookData._id, fieldsToUpdate);

        const foundBook = await Book.findById(bookData._id);
        expect(foundBook?.title).toBe(fieldsToUpdate.title);
        expect(foundBook?.authorId?.toString()).toBe(authorData4._id.toString());

        const oldAuthor = await Author.findById(authorData3._id);
        expect(oldAuthor?.booksCount).toBe(0);

        const newAuthor = await Author.findById(authorData4._id);
        expect(newAuthor?.booksCount).toBe(1);
    });

    it('Should throw error when updating a book with invalid authorId', async () => {
        const fieldsToUpdate = {
            title: 'title updated',
            authorId: new mongoose.Types.ObjectId()
        };
        await expect(() =>
            updateRecord(bookData._id, fieldsToUpdate
            )).rejects.toThrowError('Author not found');
    });

    it('Should delete a document', async () => {
        const newBookData = {
            _id: new mongoose.Types.ObjectId(),
            title: 'Book title 5',
            authorId: authorData2._id
        };
        await createRecord(newBookData, 'book');

        await deleteRecord(newBookData._id);

        const foundBook = await Book.findById(newBookData._id);
        expect(foundBook).toBeNull();

        const author = await Author.findById(authorData2._id);
        expect(author?.booksCount).toBe(0);
    });

});