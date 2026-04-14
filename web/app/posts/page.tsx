'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { Post, Category, Tag } from '@/lib/types';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import Badge from '@/components/Badge';

export default function PostsListPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Filters
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [published, setPublished] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<'createdAt' | 'title'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const limit = 10;

  async function loadPosts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (search) params.set('search', search);
      if (selectedCategory) params.set('categoryId', String(selectedCategory));
      if (selectedTag) params.set('tagId', String(selectedTag));
      if (published !== null) params.set('published', String(published));
      params.set('sortBy', sortBy);
      params.set('order', order);

      // Try paginated endpoint first, fallback to array
      const res = await apiFetch<Post[] | { data: Post[]; meta: { total: number } }>(
        `/posts?${params.toString()}`
      );

      if (Array.isArray(res)) {
        setPosts(res);
        setTotal(res.length);
      } else {
        setPosts(res.data);
        setTotal(res.meta.total);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [page, search, selectedCategory, selectedTag, published, sortBy, order]);

  useEffect(() => {
    apiFetch<Category[]>('/categories').then(setCategories).catch(() => {});
    apiFetch<Tag[]>('/tags').then(setTags).catch(() => {});
  }, []);

  function resetFilters() {
    setSearch('');
    setSelectedCategory(null);
    setSelectedTag(null);
    setPublished(null);
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  }

  const hasFilters = search || selectedCategory || selectedTag || published !== null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="text-gray-500 text-sm mt-1">Browse and filter all articles</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search posts by title, content..."
              defaultValue={search}
              onSearch={(q) => { setSearch(q); setPage(1); }}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'title')}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="createdAt">Date</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              title={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
            >
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${order === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase">Status:</span>
          <Badge label="All" active={published === null} onClick={() => { setPublished(null); setPage(1); }} />
          <Badge label="Published" active={published === true} onClick={() => { setPublished(true); setPage(1); }} />
          <Badge label="Drafts" active={published === false} onClick={() => { setPublished(false); setPage(1); }} />
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase">Category:</span>
            <Badge label="All" active={selectedCategory === null} onClick={() => { setSelectedCategory(null); setPage(1); }} />
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                label={cat.name}
                variant="category"
                active={selectedCategory === cat.id}
                onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
              />
            ))}
          </div>
        )}

        {/* Tag filter */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Tag:</span>
            <Badge label="All" active={selectedTag === null} onClick={() => { setSelectedTag(null); setPage(1); }} />
            {tags.slice(0, 10).map((tag) => (
              <Badge
                key={tag.id}
                label={tag.name}
                variant="tag"
                active={selectedTag === tag.id}
                onClick={() => { setSelectedTag(tag.id); setPage(1); }}
              />
            ))}
          </div>
        )}

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">No posts found matching your filters.</p>
          {hasFilters && (
            <button onClick={resetFilters} className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            meta={{ total, page, limit, totalPages: Math.ceil(total / limit) }}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
