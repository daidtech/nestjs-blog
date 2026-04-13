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
    <main className="single-wrap">
      <section className="panel">
        <div className="topbar">
          <h1>Create New Post</h1>
          <Link href="/" className="link-btn secondary-link">
            Back Home
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Slug (optional)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <input
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
          />
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published
          </label>

          <div className="actions">
            <button type="submit">Create Post</button>
          </div>
        </form>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </section>
    </main>
  );
}
