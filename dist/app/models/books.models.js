"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const books_schema_1 = require("../schemas/books.schema");
const borrow_models_1 = require("./borrow.models");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        enum: books_schema_1.GENRES,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    copies: {
        type: Number,
        required: true,
        min: 0,
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
bookSchema.static("updateAvailableStatus", function (book) {
    return __awaiter(this, void 0, void 0, function* () {
        book.available = book.copies > 0;
        yield book.save();
    });
});
bookSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        if (update && typeof update.copies !== "undefined") {
            if (update.copies === 0) {
                // Update `available` in the update object directly
                if (!update.$set)
                    update.$set = {};
                update.$set.available = false;
            }
            else if (update.copies > 0) {
                // If copies are greater than 0, set available to true
                if (!update.$set)
                    update.$set = {};
                update.$set.available = true;
            }
        }
        next();
    });
});
bookSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            // If a book is deleted, ensure that no borrow records reference it
            yield borrow_models_1.Borrow.deleteMany({ book: doc._id });
        }
    });
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
