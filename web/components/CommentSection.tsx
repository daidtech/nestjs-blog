'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import type { Comment } from '@/lib/types';

type Props = {
  postId: number;
};

function CommentItem({
  comment,
  onReply,
  onDelete,
  currentUserId,
  isAdmin,
}: {
  comment: Comment;
  onReply: (parentId: number) => void;
  onDelete: (id: number) => void;
  currentUserId?: number;
  isAdmin: boolean;
}) {
  const name = comment.author
    ? `${comment.author.firstName ?? ''} ${comment.author.lastName ?? ''}`.trim() || comment.author.username
    : 'Anonymous';

  const date = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const canDelete = currentUserId === comment.authorId || isAdmin;

  return (
    <div className="group">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
          {name[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800">{name}</span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Reply
            </button>
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Delete
              </button>
            )}
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId }: Props) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadComments() {
    try {
      const data = await apiFetch<Comment[]>(`/posts/${postId}/comments`);
      setComments(data);
    } catch {
      // Comments not available yet
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    setSubmitting(true);
    try {
      await apiFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: newComment.trim(),
          parentId: replyTo,
        }),
      });
      setNewComment('');
      setReplyTo(null);
      loadComments();
    } catch {
      // Handle error silently
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this comment?')) return;

    if (replyTo === id) {
      setReplyTo(null);
    }

    try {
      await apiFetch(`/comments/${id}`, { method: 'DELETE' });
      loadComments();
    } catch {
      // Handle error silently
    }
  }

  useEffect(() => {
    loadComments();
  }, [postId]);

  return (
    <section className="mt-10">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      {token ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-sm text-indigo-600">
              <span>Replying to comment</span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 text-center mb-8">
          <p className="text-sm text-gray-500">
            <a href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </a>{' '}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={setReplyTo}
              onDelete={handleDelete}
              currentUserId={user?.id}
              isAdmin={user?.role === 'ADMIN'}
            />
          ))}
        </div>
      )}
    </section>
  );
}
