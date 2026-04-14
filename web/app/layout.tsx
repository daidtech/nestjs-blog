import './globals.css';
import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export const metadata = {
  title: 'Posts CRUD UI',
  description: 'Next.js UI for NestJS Posts API',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
