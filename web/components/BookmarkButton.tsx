'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';

type Props = {
  postId: number;
  initialBookmarked?: boolean;
};

export default function BookmarkButton({ postId, initialBookmarked = false }: Props) {
  const { token } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    setLoading(true);
    try {
      await apiFetch(`/posts/${postId}/bookmark`, { method: 'POST' });
      setBookmarked(!bookmarked);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        bookmarked
          ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      <svg
        className="w-4 h-4"
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {bookmarked ? 'Saved' : 'Save'}
    </button>
  );
}
