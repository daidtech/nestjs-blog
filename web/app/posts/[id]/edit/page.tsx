'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiFetch } from '@/lib/api';
import type { Post, Category, Tag } from '@/lib/types';

type EditPostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  categoryIds: number[];
  tagIds: number[];
};

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formik = useFormik<EditPostForm>({
    initialValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      published: false,
      categoryIds: [],
      tagIds: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      slug: Yup.string().optional(),
      excerpt: Yup.string().optional(),
      content: Yup.string().optional(),
      published: Yup.boolean().required(),
      categoryIds: Yup.array().of(Yup.number()).optional(),
      tagIds: Yup.array().of(Yup.number()).optional(),
    }),
    onSubmit: async (values) => {
      setError('');
      try {
        await apiFetch(`/posts/${params.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: values.title,
            slug: values.slug || undefined,
            excerpt: values.excerpt || undefined,
            content: values.content || undefined,
            published: values.published,
            categoryIds: values.categoryIds,
            tagIds: values.tagIds,
          }),
        });
        router.push(`/posts/${params.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update post');
      }
    },
  });

  useEffect(() => {
    Promise.all([
      apiFetch<Post>(`/posts/${params.id}`),
      apiFetch<Category[]>('/categories').catch(() => []),
      apiFetch<Tag[]>('/tags').catch(() => []),
    ]).then(([post, cats, tgs]) => {
      formik.setValues({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        content: post.content ?? '',
        published: post.published,
        categoryIds: post.categories?.map((c) => c.id) ?? [],
        tagIds: post.taggings?.map((t) => t.tag.id) ?? post.tags?.map((t) => t.id) ?? [],
      });
      setCategories(cats);
      setTags(tgs);
      setLoading(false);
    }).catch((e) => {
      setError(e.message);
      setLoading(false);
    });
  }, [params.id]);

  function toggleCategory(id: number) {
    const current = formik.values.categoryIds;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    formik.setFieldValue('categoryIds', next);
  }

  function toggleTag(id: number) {
    const current = formik.values.tagIds;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    formik.setFieldValue('tagIds', next);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/posts" className="hover:text-indigo-600">Posts</Link>
        <span>/</span>
        <Link href={`/posts/${params.id}`} className="hover:text-indigo-600">{formik.values.title || 'Post'}</Link>
        <span>/</span>
        <span className="text-gray-600">Edit</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
            <input
              type="text"
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
            <textarea
              name="excerpt"
              value={formik.values.excerpt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={2}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
            <textarea
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={12}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y font-mono"
            />
          </div>

          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      formik.values.categoryIds.includes(cat.id)
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      formik.values.tagIds.includes(tag.id)
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              <p className="text-sm font-medium text-gray-700">Published</p>
              <p className="text-xs text-gray-400">Toggle post visibility</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Link href={`/posts/${params.id}`} className="text-sm text-gray-500 hover:text-gray-700 font-medium">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
