export type Paginate = {
  page: number;
  limit: number;
  sort: 'asc' | 'desc';
};

export interface ProductNotFound {
  message: string;
}
