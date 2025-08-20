export interface DefaultResponse<T> {
    message: string;
    statusCode: number;
    data?: T;
}