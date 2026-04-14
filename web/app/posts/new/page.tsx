'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { API_URL } from '@/lib/types';

type PostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
};

const emptyForm: PostForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  published: false,
};

export default function NewPostPage() {
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || undefined,
          excerpt: form.excerpt || undefined,
          content: form.content || undefined,
          published: form.published,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to create post');
      }

      setForm(emptyForm);
      setSuccess('Post created successfully.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    }
  }

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4">
      <section className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          <Link
            href="/"
            className="inline-block bg-gray-100 hover:bg-indigo-50 text-indigo-700 font-medium px-4 py-2 rounded-lg border border-indigo-200 transition-colors"
          >
            Back Home
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Slug (optional)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
          />
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            Published
          </label>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors"
            >
              Create Post
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 font-medium mt-4">{error}</p>}
        {success && <p className="text-green-600 font-medium mt-4">{success}</p>}
      </section>
    </main>
  );
}
