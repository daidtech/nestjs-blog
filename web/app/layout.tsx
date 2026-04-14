import './globals.css';
import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'Tech Blog - NestJS & Next.js',
  description: 'A full-featured blog built with NestJS and Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
