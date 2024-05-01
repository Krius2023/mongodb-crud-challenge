import { Author } from "../models/author";
import { Book } from "../models/book";

export const createRecord = async (dataToSave: any, type: string) => {
    try {
        if (type == 'author') {
            const currentAuthor = await Author.findOne({ name: dataToSave.name });
            if (currentAuthor != null) {
                throw new Error("Author name already exists");
            }

            await Author.create(dataToSave);
        }

        if (type == 'book') {
            const currentAuthor = await Author.findById(dataToSave.authorId);
            if (currentAuthor === null) {
                throw new Error("Author not found");
            }
            const bookData = await Book.findOne(
                { title: dataToSave.title },
                { authorId: dataToSave.authorId }
            );
            if (bookData != null) {
                throw new Error("Book already exists");
            }
            await Book.create(dataToSave);
            await Author.updateOne({ _id: dataToSave.authorId }, { $inc: { booksCount: 1 } });
        }
    } catch (e) {
        console.error('Error while storing the data:: ', dataToSave, e);
        throw e;
    }
};

export const updateRecord = async (id: any, fieldsToUpdate: any) => {
    try {
        let oldAuthorId;
        let newAuthorId;

        const book: any = await Book.findById(id);
        for await (const item of Object.keys(fieldsToUpdate)) {
            if (book[`${item}`] != fieldsToUpdate[`${item}`]) {
                if (item === 'authorId') {
                    oldAuthorId = book.authorId;
                    newAuthorId = fieldsToUpdate[`${item}`];

                    const currentAuthor = await Author.findById(newAuthorId);
                    if (currentAuthor === null) { throw new Error("Author not found"); }
                }
                book[`${item}`] = fieldsToUpdate[`${item}`];
            }
        };
        await book.save();

        await Author.updateOne({ _id: newAuthorId }, { $inc: { booksCount: 1 } });
        await Author.updateOne({ _id: oldAuthorId }, { $inc: { booksCount: -1 } });
    } catch (e) {
        console.error('Error while deleting the data:: ', id, e);
        throw e;
    }
};

export const deleteRecord = async (id: any) => {
    try {
        const book: any = await Book.findById(id);
        await Book.deleteOne(id);
        await Author.updateOne({ _id: book.authorId }, { $inc: { booksCount: -1 } });
    } catch (e) {
        console.error('Error while deleting the data:: ', id, e);
        throw e;
    }
};