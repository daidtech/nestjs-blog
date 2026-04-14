'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_URL, PostItem } from '@/lib/types';

export default function PostDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadPost() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/posts/${params.id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load post details');
      const data = (await res.json()) as PostItem;
      setPost(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function removePost() {
    setError('');
    try {
      const res = await fetch(`${API_URL}/posts/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    }
  }

  useEffect(() => {
    loadPost();
  }, [params.id]);

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4">
      <section className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Post Details</h1>
          <Link
            href="/"
            className="inline-block bg-gray-100 hover:bg-indigo-50 text-indigo-700 font-medium px-4 py-2 rounded-lg border border-indigo-200 transition-colors"
          >
            Back Home
          </Link>
        </div>

        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Loading...</p>}

        {post && (
          <article className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
            <p className="text-gray-400 text-sm">Slug: /{post.slug}</p>
            <p className="text-gray-400 text-sm">Published: {post.published ? 'Yes' : 'No'}</p>
            {post.excerpt && <p className="text-gray-600">{post.excerpt}</p>}
            <div className="prose max-w-none">{post.content ?? 'No content'}</div>

            <div className="flex justify-end mt-6">
              <button
                onClick={removePost}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors"
              >
                Delete Post
              </button>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
