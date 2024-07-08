import Providers from '@/components/providers/providers';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Discord',
  description: 'A chat app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className} suppressHydrationWarning>
        <head />
        <body className="bg-white dark:bg-grayish">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
