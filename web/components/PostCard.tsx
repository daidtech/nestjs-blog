'use client';

import Link from 'next/link';
import type { Post } from '@/lib/types';

type Props = {
  post: Post;
  variant?: 'default' | 'compact' | 'featured';
};

export default function PostCard({ post, variant = 'default' }: Props) {
  const authorName = post.author
    ? `${post.author.firstName ?? ''} ${post.author.lastName ?? ''}`.trim() || post.author.username
    : 'Unknown';

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const tags = post.taggings?.map((t) => t.tag) ?? post.tags ?? [];

  if (variant === 'featured') {
    return (
      <Link href={`/posts/${post.id}`} className="block group">
        <article className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-end p-6">
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="relative z-10">
              {!post.published && (
                <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded mb-2">
                  Draft
                </span>
              )}
              <h2 className="text-xl font-bold text-white group-hover:underline">
                {post.title}
              </h2>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="p-5">
            {post.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  {authorName[0]?.toUpperCase()}
                </div>
                <span>{authorName}</span>
              </div>
              <span>{date}</span>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag.id} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                    {tag.name}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-gray-400 text-xs">+{tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/posts/${post.id}`} className="block group">
        <article className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-3 -mx-3 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
            {post.title[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600">
              {post.title}
            </h3>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          {post._count && (
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{post._count.likes} likes</span>
              <span>{post._count.comments} comments</span>
            </div>
          )}
        </article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-indigo-100 transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {!post.published && (
                <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded">
                  Draft
                </span>
              )}
              {post.categories && post.categories.length > 0 && (
                <span className="text-xs text-indigo-600 font-medium">
                  {post.categories[0].name}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                  {authorName[0]?.toUpperCase()}
                </div>
                <span>{authorName}</span>
              </div>
              <span>{date}</span>
              {post._count && (
                <>
                  <span>{post._count.likes} likes</span>
                  <span>{post._count.comments} comments</span>
                </>
              )}
            </div>
          </div>
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
            />
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-50">
            {tags.map((tag) => (
              <span key={tag.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full hover:bg-indigo-50 hover:text-indigo-600">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
