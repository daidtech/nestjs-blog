import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-bold text-white">Tech Blog</span>
            </div>
            <p className="text-sm text-gray-500">
              A full-featured blog platform built with NestJS and Next.js.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm hover:text-white transition-colors">Home</Link>
              <Link href="/posts" className="block text-sm hover:text-white transition-colors">Posts</Link>
              <Link href="/categories" className="block text-sm hover:text-white transition-colors">Categories</Link>
              <Link href="/tags" className="block text-sm hover:text-white transition-colors">Tags</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Account
            </h4>
            <div className="space-y-2">
              <Link href="/auth/login" className="block text-sm hover:text-white transition-colors">Sign In</Link>
              <Link href="/auth/register" className="block text-sm hover:text-white transition-colors">Sign Up</Link>
              <Link href="/profile" className="block text-sm hover:text-white transition-colors">Profile</Link>
              <Link href="/profile/bookmarks" className="block text-sm hover:text-white transition-colors">Bookmarks</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <div className="space-y-2">
              <span className="block text-sm">NestJS Docs</span>
              <span className="block text-sm">Next.js Docs</span>
              <span className="block text-sm">Prisma Docs</span>
              <span className="block text-sm">Tailwind CSS</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Tech Blog. Built for learning NestJS.
          </p>
        </div>
      </div>
    </footer>
  );
}
