'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type PostItem = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  published: boolean;
};

type PostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const emptyForm: PostForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  published: false,
};

export default function Page() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const isEditing = useMemo(() => editingId !== null, [editingId]);

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

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      excerpt: form.excerpt || undefined,
      content: form.content || undefined,
      published: form.published,
    };

    const url = isEditing ? `${API_URL}/posts/${editingId}` : `${API_URL}/posts`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }

      resetForm();
      await loadPosts();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    }
  }

  function startEdit(post: PostItem) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      published: post.published,
    });
  }

  async function removePost(id: number) {
    setError('');
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      if (editingId === id) {
        resetForm();
      }
      await loadPosts();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    }
  }

  return (
    <main className="wrap">
      <section className="panel">
        <h1>NestJS Posts CRUD</h1>
        <p>API: {API_URL}</p>

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
            rows={5}
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
            <button type="submit">{isEditing ? 'Update Post' : 'Create Post'}</button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="secondary">
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel">
        <h2>Posts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="list">
            {posts.map((post) => (
              <li key={post.id}>
                <div>
                  <strong>{post.title}</strong>
                  <p>/{post.slug}</p>
                </div>
                <div className="actions">
                  <button onClick={() => startEdit(post)} className="secondary">
                    Edit
                  </button>
                  <button onClick={() => removePost(post.id)} className="danger">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
