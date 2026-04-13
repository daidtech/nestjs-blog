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
    <main className="single-wrap">
      <section className="panel">
        <div className="topbar">
          <h1>Post Details</h1>
          <Link href="/" className="link-btn secondary-link">
            Back Home
          </Link>
        </div>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}

        {post && (
          <article className="detail">
            <h2>{post.title}</h2>
            <p className="muted">Slug: /{post.slug}</p>
            <p className="muted">Published: {post.published ? 'Yes' : 'No'}</p>
            {post.excerpt && <p>{post.excerpt}</p>}
            <div>{post.content ?? 'No content'}</div>

            <div className="actions">
              <button onClick={removePost} className="danger">
                Delete Post
              </button>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
