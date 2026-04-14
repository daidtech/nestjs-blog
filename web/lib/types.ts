// ─── API Config ───
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// ─── User ───
export type User = {
  id: number;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  role?: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Post ───
export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  published: boolean;
  featuredImage?: string | null;
  authorId: number;
  author?: User;
  categories?: Category[];
  tags?: Tag[];
  taggings?: { tag: Tag; assignedAt: string }[];
  _count?: { comments: number; likes: number };
  liked?: boolean;
  bookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
};

// Keep backward compat
export type PostItem = Post;

// ─── Category ───
export type Category = {
  id: number;
  name: string;
  slug: string;
  _count?: { posts: number };
  createdAt: string;
  updatedAt: string;
};

// ─── Tag ───
export type Tag = {
  id: number;
  name: string;
  slug: string;
  _count?: { taggings: number };
  createdAt: string;
  updatedAt: string;
};

// ─── Comment ───
export type Comment = {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  author?: User;
  parentId?: number | null;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
};

// ─── Pagination ───
export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

// ─── Auth ───
export type LoginResponse = {
  access_token: string;
};

export type AuthUser = User & {
  role: 'USER' | 'ADMIN';
};
