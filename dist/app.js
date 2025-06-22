"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./app/controllers/books.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/books", books_controller_1.booksRoutes);
app.use("/api/borrow", borrow_controller_1.borrowRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to Library Management API with Express, TypeScript & MongoDB');
});
// 404 Not Found handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// Global error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
exports.default = app;
