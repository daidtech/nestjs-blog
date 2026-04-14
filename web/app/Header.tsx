import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-gray-900 text-white py-4 px-8 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold">
        <Link href="/" className="hover:underline">
          Technical Blog
        </Link>
      </h1>
      <nav>
        <Link href="/" className="mr-6 hover:underline">Home</Link>
        <Link href="/posts/new" className="hover:underline">New Post</Link>
      </nav>
    </header>
  );
}
