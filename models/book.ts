import { model, Schema } from "mongoose";

const bookSchema = new Schema({
    title: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, required: true },
    addedOn: { type: Date, default: () => Date.now() }
});

export const Book = model('Book', bookSchema);