'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_URL, PostItem } from '@/lib/types';

export default function Page() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  async function loadPosts() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load posts');
      const data = (await res.json()) as PostItem[];
      setPosts(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <main className="max-w-3xl mx-auto mt-10 px-4">
      <section className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Posts</h1>
            <p className="text-gray-500">Browse all posts from your NestJS API.</p>
          </div>
          <Link
            href="/posts/new"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors"
          >
            Create New Post
          </Link>
        </div>

        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id} className="flex items-center justify-between py-4">
                <div>
                  <strong className="block text-lg text-gray-800">{post.title}</strong>
                  <span className="text-gray-400 text-sm">/{post.slug}</span>
                </div>
                <Link
                  href={`/posts/${post.id}`}
                  className="inline-block bg-gray-100 hover:bg-indigo-50 text-indigo-700 font-medium px-4 py-1.5 rounded-lg border border-indigo-200 transition-colors"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
