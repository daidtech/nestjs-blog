'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';

export default function SettingsPage() {
  const { user, login } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const profileFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      username: user?.username ?? '',
      bio: user?.bio ?? '',
      phoneNumber: user?.phoneNumber ?? '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(32, 'Must be 32 characters or less'),
      lastName: Yup.string().max(32, 'Must be 32 characters or less'),
      username: Yup.string().max(32, 'Must be 32 characters or less'),
      bio: Yup.string().max(160, 'Bio must be 160 characters or less'),
      phoneNumber: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      setError('');
      setSuccess('');
      try {
        const updated = await apiFetch<typeof user>(`/users/${user!.id}`, {
          method: 'PATCH',
          body: JSON.stringify(values),
        });
        login(localStorage.getItem('token')!, { ...user!, ...updated });
        setSuccess('Profile updated successfully');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Update failed');
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Confirm your new password'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setError('');
      setSuccess('');
      try {
        await apiFetch('/auth/change-password', {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          }),
        });
        resetForm();
        setSuccess('Password changed successfully');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Password change failed');
      }
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Not signed in</h2>
        <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/profile" className="hover:text-indigo-600">Profile</Link>
        <span>/</span>
        <span className="text-gray-600">Settings</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

      {success && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">{success}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>
      )}

      {/* Profile Info */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
        <form onSubmit={profileFormik.handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
              {(profileFormik.values.firstName || user.username)[0]?.toUpperCase()}
            </div>
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Change avatar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profileFormik.values.firstName}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
              {profileFormik.touched.firstName && profileFormik.errors.firstName && (
                <p className="text-xs text-red-600 mt-2">{profileFormik.errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profileFormik.values.lastName}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
              {profileFormik.touched.lastName && profileFormik.errors.lastName && (
                <p className="text-xs text-red-600 mt-2">{profileFormik.errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <input
              type="text"
              name="username"
              value={profileFormik.values.username}
              onChange={profileFormik.handleChange}
              onBlur={profileFormik.handleBlur}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {profileFormik.touched.username && profileFormik.errors.username && (
              <p className="text-xs text-red-600 mt-2">{profileFormik.errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea
              name="bio"
              value={profileFormik.values.bio}
              onChange={profileFormik.handleChange}
              onBlur={profileFormik.handleBlur}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            />
            {profileFormik.touched.bio && profileFormik.errors.bio && (
              <p className="text-xs text-red-600 mt-2">{profileFormik.errors.bio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={profileFormik.values.phoneNumber}
              onChange={profileFormik.handleChange}
              onBlur={profileFormik.handleBlur}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {profileFormik.touched.phoneNumber && profileFormik.errors.phoneNumber && (
              <p className="text-xs text-red-600 mt-2">{profileFormik.errors.phoneNumber}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileFormik.isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {profileFormik.isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>

      {/* Change Password */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>
        <form onSubmit={passwordFormik.handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordFormik.values.currentPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
              <p className="text-xs text-red-600 mt-2">{passwordFormik.errors.currentPassword}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordFormik.values.newPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
              <p className="text-xs text-red-600 mt-2">{passwordFormik.errors.newPassword}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordFormik.values.confirmPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-2">{passwordFormik.errors.confirmPassword}</p>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordFormik.isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {passwordFormik.isSubmitting ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          Delete Account
        </button>
      </section>
    </div>
  );
}
