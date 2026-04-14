'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const name = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username
    : '';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Tech Blog
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Home
            </Link>
            <Link href="/posts" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Posts
            </Link>
            <Link href="/categories" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Categories
            </Link>
            <Link href="/tags" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Tags
            </Link>
            {isAdmin && (
              <Link href="/admin" className="px-3 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/posts/new"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write
                </Link>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {name[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <Link href="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                          Profile
                        </Link>
                        <Link href="/profile/bookmarks" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                          Bookmarks
                        </Link>
                        <Link href="/profile/settings" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                          Settings
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => { logout(); setProfileOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
              Home
            </Link>
            <Link href="/posts" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
              Posts
            </Link>
            <Link href="/categories" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
              Categories
            </Link>
            <Link href="/tags" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
              Tags
            </Link>
            {user && (
              <Link href="/posts/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg">
                Write Post
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg">
                Admin Dashboard
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
