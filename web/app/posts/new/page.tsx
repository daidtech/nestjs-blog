'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiFetch } from '@/lib/api';
import ReactSelect2 from '@/components/ReactSelect2';
import type { Category, Tag } from '@/lib/types';

type PostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  categoryIds: number[];
  tagIds: number[];
};

const emptyForm: PostForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  published: false,
  categoryIds: [],
  tagIds: [],
};

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: emptyForm,
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      slug: Yup.string().optional(),
      excerpt: Yup.string().optional(),
      content: Yup.string().optional(),
      published: Yup.boolean().required(),
      categoryIds: Yup.array().of(Yup.number()).optional(),
      tagIds: Yup.array().of(Yup.number()).optional(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const res = await apiFetch<{ id: number }>('/posts', {
          method: 'POST',
          body: JSON.stringify({
            title: values.title,
            slug: values.slug || undefined,
            excerpt: values.excerpt || undefined,
            content: values.content || undefined,
            published: values.published,
            categoryIds: values.categoryIds.length > 0 ? values.categoryIds : undefined,
            tagIds: values.tagIds.length > 0 ? values.tagIds : undefined,
          }),
        });

        router.push(`/posts/${res.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create post');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    apiFetch<Category[]>('/categories').then(setCategories).catch(() => {});
    apiFetch<Tag[]>('/tags').then(setTags).catch(() => {});
  }, []);


  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/posts" className="hover:text-indigo-600">Posts</Link>
        <span>/</span>
        <span className="text-gray-600">New Post</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter post title"
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Slug <span className="text-gray-400 font-normal">(auto-generated if empty)</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="my-post-slug"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
            <textarea
              name="excerpt"
              value={formik.values.excerpt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Brief summary of the post"
              rows={2}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
            <textarea
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Write your post content..."
              rows={12}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y font-mono"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <ReactSelect2
              options={categories}
              value={formik.values.categoryIds}
              onChange={(selectedIds) => formik.setFieldValue('categoryIds', selectedIds)}
              onCreate={async (name) => {
                const created = await apiFetch<Category>('/categories', {
                  method: 'POST',
                  body: JSON.stringify({ name }),
                });
                setCategories((prev) => [...prev, created]);
                return created;
              }}
              placeholder="Select or create categories"
              allowCreate
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <ReactSelect2
              options={tags}
              value={formik.values.tagIds}
              onChange={(selectedIds) => formik.setFieldValue('tagIds', selectedIds)}
              onCreate={async (name) => {
                const created = await apiFetch<Tag>('/tags', {
                  method: 'POST',
                  body: JSON.stringify({ name }),
                });
                setTags((prev) => [...prev, created]);
                return created;
              }}
              placeholder="Select or create tags"
              allowCreate
            />
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formik.values.published}
                onChange={(e) => formik.setFieldValue('published', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
            <div>
              <p className="text-sm font-medium text-gray-700">Publish immediately</p>
              <p className="text-xs text-gray-400">Make this post visible to everyone</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Link
              href="/posts"
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
