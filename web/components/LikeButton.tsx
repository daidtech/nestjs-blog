'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { redirectToLogin } from '@/lib/navigation';

type Props = {
  postId: number;
  initialLiked?: boolean;
  initialCount?: number;
};

export default function LikeButton({ postId, initialLiked = false, initialCount = 0 }: Props) {
  const { token } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!token) {
      redirectToLogin();
      return;
    }

    setLoading(true);
    try {
      await apiFetch(`/posts/${postId}/like`, { method: 'POST' });
      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
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
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      <svg
        className={`w-4 h-4 ${liked ? 'fill-current' : ''}`}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {count}
    </button>
  );
}
