"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
const mongoose_1 = require("mongoose");
const authorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    booksCount: { type: Number, default: 0 },
    addedOn: { type: Date, default: () => Date.now() }
});
exports.Author = (0, mongoose_1.model)('Author', authorSchema);
