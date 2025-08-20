import { DefaultResponse } from "./default-response.model";

export interface PaginatedResponse<T> extends DefaultResponse<T[]> {
    totalCount: number;
    currentPage: number;
    pageSize: number;
}