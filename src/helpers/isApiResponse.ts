export interface ApiErrorResponse {
    status: number;
    data: { message: string; errors: { [k: string]: string[] } };
}

export function isApiResponse(error: unknown): error is ApiErrorResponse {
    return (
        typeof error === "object" &&
        error != null &&
        "status" in error &&
        typeof (error as any).status === "number" &&
        typeof (error as any).message === "string"
    );
}

export interface ApiError {
    status: number;
    message: string;
}

export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error != null &&
        typeof (error as any).message === "string"
    );
}