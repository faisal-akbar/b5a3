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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_models_1 = require("../models/books.models");
const books_schema_1 = require("../schemas/books.schema");
const formatZodError_1 = require("../utils/formatZodError");
exports.booksRoutes = express_1.default.Router();
// Create Book
exports.booksRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseBody = yield books_schema_1.bookSchema.safeParseAsync(req.body);
    if (!parseBody.success) {
        const errorResponse = (0, formatZodError_1.formatZodError)(parseBody.error, req.body);
        res.status(400).json(errorResponse);
        return;
    }
    try {
        const book = yield books_models_1.Book.create(parseBody.data);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Get All Books or by provided query parameters
exports.booksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If no query parameters are provided, return 10 books by default
        if (Object.keys(req.query).length === 0) {
            const books = yield books_models_1.Book.find({}).limit(10);
            res.status(200).json({
                success: true,
                message: "Books retrieved successfully",
                data: books,
            });
            return;
        }
        // zod validation:
        const parseResult = books_schema_1.querySchema.safeParse(req.query);
        if (!parseResult.success) {
            const errorResponse = (0, formatZodError_1.formatZodError)(parseResult.error, req.query);
            res.status(400).json(errorResponse);
            return;
        }
        const { filter, sortBy, sort, limit = 10 } = parseResult.data;
        // Build query based on filter and sort and limit query parameters
        const query = {};
        if (filter) {
            query.genre = filter.toUpperCase();
        }
        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sort === "desc" ? -1 : 1;
        }
        // If no sortBy is provided, default to sorting by title in ascending order
        const books = yield books_models_1.Book.find(query).sort(sortOptions).limit(Number(limit));
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching books",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Get Book by ID
exports.booksRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseParams = books_schema_1.bookParamsSchema.safeParse(req.params);
    if (!parseParams.success) {
        const errorResponse = (0, formatZodError_1.formatZodError)(parseParams.error, req.params);
        res.status(400).json(errorResponse);
        return;
    }
    const bookId = req.params.bookId;
    try {
        const book = yield books_models_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Update Book by bookId
exports.booksRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseParams = books_schema_1.bookParamsSchema.safeParse(req.params);
    if (!parseParams.success) {
        const errorResponse = (0, formatZodError_1.formatZodError)(parseParams.error, req.params);
        res.status(400).json(errorResponse);
        return;
    }
    const parseBody = yield books_schema_1.bookUpdateSchema.safeParseAsync(req.body);
    if (!parseBody.success) {
        const errorResponse = (0, formatZodError_1.formatZodError)(parseBody.error, req.body);
        res.status(400).json(errorResponse);
        return;
    }
    const bookId = req.params.bookId;
    try {
        const updatedBook = yield books_models_1.Book.findOneAndUpdate({ _id: bookId }, parseBody.data, { new: true, runValidators: true });
        if (!updatedBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Delete Book by bookId
exports.booksRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseParams = books_schema_1.bookParamsSchema.safeParse(req.params);
    if (!parseParams.success) {
        const errorResponse = (0, formatZodError_1.formatZodError)(parseParams.error, req.params);
        res.status(400).json(errorResponse);
        return;
    }
    const bookId = req.params.bookId;
    try {
        const deletedBook = yield books_models_1.Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: deletedBook,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
