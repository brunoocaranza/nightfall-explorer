export class PaginationModel<T> {
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

export class PaginationBuilder<T> extends PaginationModel<T> {
  setLimit(limit: number) {
    this.limit = limit;
    return this;
  }

  setPage(page: number) {
    this.page = page;
    return this;
  }

  setTotalDocs(count: number) {
    this.totalDocs = count;
    return this;
  }

  setTotalPages() {
    this.totalPages = Math.ceil(this.totalDocs / this.limit);
    return this;
  }

  setDocs(docs: T[]) {
    this.docs = docs;
    return this;
  }

  setHasPrevPage() {
    if (this.page > 1) {
      this.hasPrevPage = true;
    } else this.hasPrevPage = false;
    return this;
  }

  setPrevPage() {
    if (this.page > 1) {
      this.prevPage = this.page - 1;
    } else this.prevPage = null;
    return this;
  }

  setHasNextPage() {
    if (this.page < this.totalPages) {
      this.hasNextPage = true;
    } else this.hasNextPage = false;

    return this;
  }

  setNextPage() {
    if (this.page < this.totalPages) {
      this.nextPage = this.page + 1;
    } else this.nextPage = null;

    return this;
  }

  setPagingCounter() {
    this.pagingCounter = (this.page - 1) * this.limit + 1;
    return this;
  }
}
