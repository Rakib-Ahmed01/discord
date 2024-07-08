import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';
import './globals.css';

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
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
