export interface ApiResponse<T> {
  id:number,
  error:boolean,
  title:string,
  object:T,
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

export interface ErrorResponse {
  message: string;
  status: number;
  errors?: { [key: string]: string[] };
}
