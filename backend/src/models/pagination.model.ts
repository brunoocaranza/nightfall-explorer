export interface PaginationModel<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page?: number;
  totalPages: number;
  prevPage?: number | null;
  nextPage?: number | null;
  pagingCounter: number;
}
