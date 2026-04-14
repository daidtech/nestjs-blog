'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import type { Post } from '@/lib/types';
import Badge from '@/components/Badge';
import LikeButton from '@/components/LikeButton';
import BookmarkButton from '@/components/BookmarkButton';
import CommentSection from '@/components/CommentSection';

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwner = user && post && user.id === post.authorId;
  const canEdit = isOwner || isAdmin;

  useEffect(() => {
    apiFetch<Post>(`/posts/${params.id}`)
      .then(setPost)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiFetch(`/posts/${params.id}`, { method: 'DELETE' });
      router.push('/posts');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
        <p className="text-gray-500 mb-6">{error || 'This post does not exist.'}</p>
        <Link href="/posts" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Back to posts
        </Link>
      </div>
    );
  }

  const authorName = post.author
    ? `${post.author.firstName ?? ''} ${post.author.lastName ?? ''}`.trim() || post.author.username
    : 'Unknown';

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tags = post.taggings?.map((t) => t.tag) ?? post.tags ?? [];

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/posts" className="hover:text-indigo-600">Posts</Link>
        <span>/</span>
        <span className="text-gray-600 truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {!post.published && (
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">
              Draft
            </span>
          )}
          {post.categories && post.categories.map((cat) => (
            <Badge key={cat.id} label={cat.name} href={`/categories/${cat.id}`} variant="category" size="md" />
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-gray-500 mb-6">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              {authorName[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{authorName}</p>
              <p className="text-xs text-gray-400">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LikeButton
              postId={post.id}
              initialLiked={post.liked}
              initialCount={post._count?.likes ?? 0}
            />
            <BookmarkButton postId={post.id} initialBookmarked={post.bookmarked} />
            {canEdit && (
              <>
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img src={post.featuredImage} alt={post.title} className="w-full h-auto" />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        {post.content ? (
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {post.content}
          </div>
        ) : (
          <p className="text-gray-400 italic">No content yet.</p>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-6 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-500">Tags:</span>
          {tags.map((tag) => (
            <Badge key={tag.id} label={tag.name} href={`/tags/${tag.id}`} variant="tag" size="md" />
          ))}
        </div>
      )}

      {/* Author Card */}
      {post.author && (
        <div className="bg-gray-50 rounded-2xl p-6 mt-6 flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
            {authorName[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900">{authorName}</p>
            <p className="text-sm text-gray-500 mt-1">
              {post.author.bio ?? 'This author has not set up a bio yet.'}
            </p>
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentSection postId={post.id} />
    </article>
  );
}
