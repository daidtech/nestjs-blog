'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import Badge from './Badge';
import type { Category, Tag } from '@/lib/types';

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    apiFetch<Category[]>('/categories').then(setCategories).catch(() => {});
    apiFetch<Tag[]>('/tags').then(setTags).catch(() => {});
  }, []);

  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Categories
        </h3>
        {categories.length === 0 ? (
          <p className="text-xs text-gray-400">No categories yet</p>
        ) : (
          <div className="space-y-1.5">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                <span>{cat.name}</span>
                {cat._count && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {cat._count.posts}
                  </span>
                )}
              </a>
            ))}
          </div>
        )}
        <a
          href="/categories"
          className="block text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-4"
        >
          View all categories
        </a>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Popular Tags
        </h3>
        {tags.length === 0 ? (
          <p className="text-xs text-gray-400">No tags yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 15).map((tag) => (
              <Badge
                key={tag.id}
                label={tag.name}
                href={`/tags/${tag.id}`}
                variant="tag"
                count={tag._count?.taggings}
              />
            ))}
          </div>
        )}
        <a
          href="/tags"
          className="block text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-4"
        >
          View all tags
        </a>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
        <h3 className="font-bold mb-2">Stay Updated</h3>
        <p className="text-sm text-indigo-100 mb-4">
          Get the latest posts delivered to your inbox.
        </p>
        <input
          type="email"
          placeholder="Your email"
          className="w-full px-3 py-2 text-sm rounded-lg bg-white/20 text-white placeholder-indigo-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 mb-2"
        />
        <button className="w-full bg-white text-indigo-600 font-semibold text-sm py-2 rounded-lg hover:bg-indigo-50 transition-colors">
          Subscribe
        </button>
      </div>
    </aside>
  );
}
