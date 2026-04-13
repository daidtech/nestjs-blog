export type PostItem = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  published: boolean;
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
