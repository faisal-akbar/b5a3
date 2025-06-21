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
exports.borrowRoutes = void 0;
const express_1 = require("express");
const books_models_1 = require("../models/books.models");
const borrow_schema_1 = require("../schemas/borrow.schema");
const formatZodError_1 = require("../utils/formatZodError");
const borrow_models_1 = require("../models/borrow.models");
exports.borrowRoutes = (0, express_1.Router)();
// POST /api/borrow
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseBody = yield borrow_schema_1.borrowSchema.safeParseAsync(req.body);
    if (!parseBody.success) {
        const errorResponse = (0, formatZodError_1.formatZodError)(parseBody.error, req.body);
        res.status(400).json(errorResponse);
        return;
    }
    try {
        const { book, quantity, dueDate } = parseBody.data;
        // Check if the book exists and has enough copies available
        const bookRecord = yield books_models_1.Book.findById(book);
        if (!bookRecord) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        // Verify the book has enough available copies.
        if (bookRecord.copies < quantity) {
            res.status(400).json({
                success: false,
                message: "Not enough copies available",
            });
            return;
        }
        // Deduct the requested quantity from the book’s copies.
        bookRecord.copies -= quantity;
        // If copies become 0, update available to false
        books_models_1.Book.updateAvailableStatus(bookRecord);
        // Save the borrow record with all relevant details.
        const borrow = yield borrow_models_1.Borrow.create({
            book: bookRecord._id,
            quantity,
            dueDate: new Date(dueDate),
        });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error borrowing book",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// GET /api/borrow
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowedBooks = yield borrow_models_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            {
                $unwind: "$bookDetails",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrowedBooks,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving borrowed books summary",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
