'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Tag, Post } from '@/lib/types';
import PostCard from '@/components/PostCard';

export default function TagDetailPage() {
  const params = useParams<{ id: string }>();
  const [tag, setTag] = useState<Tag | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<Tag & { taggings?: { post: Post }[] }>(`/tags/${params.id}`),
      apiFetch<Post[]>(`/posts?tagId=${params.id}`).catch(() => []),
    ]).then(([tagData, tagPosts]) => {
      setTag(tagData);
      const postsFromTag = tagData.taggings?.map((t) => t.post) ?? [];
      setPosts(postsFromTag.length > 0 ? postsFromTag : tagPosts);
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

  if (!tag) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tag not found</h2>
        <Link href="/tags" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Back to tags
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/tags" className="hover:text-indigo-600">Tags</Link>
        <span>/</span>
        <span className="text-gray-600">{tag.name}</span>
      </nav>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl opacity-50">#</span>
          <h1 className="text-3xl font-bold">{tag.name}</h1>
        </div>
        <p className="text-indigo-200 mt-2">
          {posts.length} post{posts.length !== 1 ? 's' : ''} tagged
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">No posts with this tag yet.</p>
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
