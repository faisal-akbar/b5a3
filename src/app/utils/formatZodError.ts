import { ZodError } from "zod";


export function formatZodError(error: ZodError, source: any) {
  const errors: Record<string, any> = {};

  for (const issue of error.errors) {
    const field = issue.path[0];
    const properties: Record<string, any> = {
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
