"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = formatZodError;
function formatZodError(error, source) {
    const errors = {};
    for (const issue of error.errors) {
        const field = issue.path[0];
        const properties = {
            message: issue.message,
            type: issue.code,
        };
        if ('minimum' in issue) {
            properties.min = issue.minimum;
        }
        if ('options' in issue) {
            properties.enum = issue.options;
        }
        errors[field] = {
            message: issue.message,
            name: 'ValidatorError',
            properties,
            kind: issue.code,
            path: field,
            value: source[field],
        };
    }
    return {
        message: 'Validation failed',
        success: false,
        error: {
            name: 'ValidationError',
            errors,
        },
    };
}
