"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    authorId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    addedOn: { type: Date, default: () => Date.now() }
});
exports.Book = (0, mongoose_1.model)('Book', bookSchema);
