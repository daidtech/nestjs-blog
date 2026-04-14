export default function Header() {
  return (
    <header className="w-full bg-gray-900 text-white py-4 px-8 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold">Technical Blog</h1>
      <nav>
        <a href="/" className="mr-6 hover:underline">Home</a>
        <a href="/posts/new" className="hover:underline">New Post</a>
      </nav>
    </header>
  );
}
