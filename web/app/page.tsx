'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Post, Category, Tag } from '@/lib/types';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (selectedCategory) params.set('categoryId', String(selectedCategory));
    if (selectedTag) params.set('tagId', String(selectedTag));

    const path = `/posts${params.toString() ? `?${params.toString()}` : ''}`;

    Promise.all([
      apiFetch<Post[]>(path),
      apiFetch<Category[]>('/categories').catch(() => []),
      apiFetch<Tag[]>('/tags').catch(() => []),
    ])
      .then(([postList, cats, tgs]) => {
        setPosts(postList);
        setCategories(cats);
        setTags(tgs);
      })
      .catch(() => {
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedTag]);

  const featured = posts.slice(0, 3);
  const recent = posts.slice(3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Welcome to Tech Blog
            </h1>
            <p className="text-lg text-indigo-200 mb-8">
              Explore articles about NestJS, Next.js, TypeScript, and modern web development.
            </p>
            <div className="max-w-lg mx-auto">
              <SearchBar
                placeholder="Search articles..."
                onSearch={(q) => {
                  if (q) window.location.href = `/posts?search=${encodeURIComponent(q)}`;
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Loading posts...</p>
            </div>
          </div>
        ) : (
          <>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Filter posts on the home page</h2>
                  <p className="text-sm text-gray-500 mt-1">Select a category or a tag to narrow the feed.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedTag(null);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear filters
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {categories.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedTag(null);
                        }}
                        className={`px-3 py-1.5 rounded-full border text-sm ${selectedCategory === null ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setSelectedTag(null);
                          }}
                          className={`px-3 py-1.5 rounded-full border text-sm ${selectedCategory === cat.id ? 'bg-emerald-600 text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Tag</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTag(null);
                          setSelectedCategory(null);
                        }}
                        className={`px-3 py-1.5 rounded-full border text-sm ${selectedTag === null ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                      >
                        All
                      </button>
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            setSelectedTag(tag.id);
                            setSelectedCategory(null);
                          }}
                          className={`px-3 py-1.5 rounded-full border text-sm ${selectedTag === tag.id ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Featured Posts */}
            {featured.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
                  <Link href="/posts" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((post) => (
                    <PostCard key={post.id} post={post} variant="featured" />
                  ))}
                </div>
              </section>
            )}

            {/* Main content + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Posts */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
                {recent.length === 0 && featured.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Start building your blog by creating your first post.
                    </p>
                    <Link
                      href="/posts/new"
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                      Create First Post
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recent.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Sidebar />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
