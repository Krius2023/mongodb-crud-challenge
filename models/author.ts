import { model, Schema } from "mongoose";

const authorSchema = new Schema({
    name: { type: String, required: true },
    booksCount: { type: Number, default: 0 },
    addedOn: { type: Date, default: () => Date.now() }
});

export const Author = model('Author', authorSchema);