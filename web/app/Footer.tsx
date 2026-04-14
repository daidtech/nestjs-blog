export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-4 px-8 mt-8 text-center text-sm">
      <span>&copy; {new Date().getFullYear()} Technical Blog. All rights reserved.</span>
    </footer>
  );
}
