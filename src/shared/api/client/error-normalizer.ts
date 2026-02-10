import { AxiosError } from 'axios';
import { ErrorCode } from '../../errors/error-codes';

export interface NormalizedError {
  code: ErrorCode;
  message: string;
  fields?: Array<{ field: string; message: string }>;
}

/**
 * Normalize API errors to a consistent format
 */
export function normalizeError(error: unknown): NormalizedError {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (data?.error) {
      return {
        code: data.error.code || ErrorCode.INTERNAL_ERROR,
        message: data.error.message || 'An error occurred',
        fields: data.error.fields,
      };
    }

    return {
      code: ErrorCode.INTERNAL_ERROR,
      message: error.message || 'Network error occurred',
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      code: ErrorCode.INTERNAL_ERROR,
      message: error.message,
    };
  }

  // Unknown error type
  return {
    code: ErrorCode.INTERNAL_ERROR,
    message: 'An unexpected error occurred',
  };
}
