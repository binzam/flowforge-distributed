import axios from "axios";

interface ApiErrorResponse {
  status: "error";
  message: string;
  errors?: unknown;
}
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown;

  constructor(message: string, statusCode: number, errors?: unknown) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const getApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const statusCode = error.response?.status ?? 500;
    const data = error.response?.data;

    if (data?.message) {
      return new ApiError(data.message, statusCode, data.errors);
    }

    return new ApiError("Something went wrong. Please try again.", statusCode);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError("Something went wrong. Please try again.", 500);
};
