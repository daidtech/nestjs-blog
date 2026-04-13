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
    <main className="single-wrap">
      <section className="panel">
        <div className="topbar">
          <div>
            <h1>Posts</h1>
            <p>Browse all posts from your NestJS API.</p>
          </div>
          <Link href="/posts/new" className="link-btn">
            Create New Post
          </Link>
        </div>

        {error && <p className="error">{error}</p>}
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
                <Link href={`/posts/${post.id}`} className="link-btn secondary-link">
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
