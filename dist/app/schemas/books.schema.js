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
exports.bookParamsSchema = exports.querySchema = exports.bookUpdateSchema = exports.bookSchema = exports.GENRES = void 0;
const validator_1 = require("validator");
const zod_1 = require("zod");
const books_models_1 = require("../models/books.models");
exports.GENRES = [
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
];
const baseBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    author: zod_1.z.string().min(1, "Author is required"),
    genre: zod_1.z.enum(exports.GENRES, {
        message: "Genre must be one of the predefined values",
    }),
    isbn: zod_1.z.string().refine((isbn) => __awaiter(void 0, void 0, void 0, function* () {
        const isISBN = yield books_models_1.Book.findOne({ isbn });
        return !isISBN;
    }), "ISBN already exists"),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().min(0, "Copies must be a positive number"),
    available: zod_1.z.boolean().default(true),
});
exports.bookSchema = baseBookSchema.superRefine((data, ctx) => {
    if (data.copies === 0 && data.available) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "If copies are 0, available must be false",
            path: ["available"],
        });
    }
    else if (data.copies > 0 && !data.available) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "If copies are more than 0, available must be true",
            path: ["available"],
        });
    }
});
exports.bookUpdateSchema = baseBookSchema.partial().superRefine((data, ctx) => {
    // Only validate if both fields are present in the update
    if (typeof data.copies === "number" &&
        typeof data.available === "boolean") {
        if (data.copies > 0 && data.available === false) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Cannot set available to false when copies is more than 0",
                path: ["available"],
            });
        }
        if (data.copies === 0 && data.available === true) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "If copies are 0, available must be false",
                path: ["available"],
            });
        }
    }
});
exports.querySchema = zod_1.z.object({
    filter: zod_1.z.string().optional().refine((val) => {
        return !val || exports.GENRES.includes(val.toUpperCase());
    }, {
        message: `Filter must be one of the predefined genres: ${exports.GENRES.join(", ")}`,
    }),
    sortBy: zod_1.z.string().optional(),
    sort: zod_1.z.enum(["asc", "desc"]),
    limit: zod_1.z
        .string()
        .transform(Number)
        .refine((val) => val > 0, {
        message: "Limit must be a positive number",
    })
        .optional()
        .default("10"),
});
exports.bookParamsSchema = zod_1.z.object({
    bookId: zod_1.z
        .string()
        .refine((val) => (0, validator_1.isMongoId)(val), {
        message: "Invalid mongo db id format",
    })
});
