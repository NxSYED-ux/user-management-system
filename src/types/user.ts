export type roles = "ADMIN" | "EDITOR" | "VIEWER";

export interface user {
  id: string;
  name: string;
  email: string;
  role: roles;
  createdAt: Date;
}

export interface paginationDef {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
