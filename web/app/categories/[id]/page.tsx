'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Category, Post } from '@/lib/types';
import PostCard from '@/components/PostCard';

export default function CategoryDetailPage() {
  const params = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<Category & { posts?: Post[] }>(`/categories/${params.id}`),
      apiFetch<Post[]>(`/posts?categoryId=${params.id}`).catch(() => []),
    ]).then(([cat, catPosts]) => {
      setCategory(cat);
      setPosts(cat.posts ?? catPosts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Category not found</h2>
        <Link href="/categories" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Back to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-indigo-600">Categories</Link>
        <span>/</span>
        <span className="text-gray-600">{category.name}</span>
      </nav>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-emerald-100">
          {posts.length} post{posts.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">No posts in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
