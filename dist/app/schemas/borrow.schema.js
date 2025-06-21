"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowSchema = void 0;
const validator_1 = require("validator");
const zod_1 = require("zod");
exports.borrowSchema = zod_1.z.object({
    book: zod_1.z.string().refine((val) => (0, validator_1.isMongoId)(val), {
        message: "Invalid mongo db id format",
    }),
    quantity: zod_1.z
        .number()
        .min(1, "Quantity must be at least 1"),
    dueDate: zod_1.z
        .string()
        .transform((val) => new Date(val))
        .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date format",
    })
        .refine((date) => date > new Date(), {
        message: "Due date must be in the future",
    }),
});
