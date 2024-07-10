import Providers from '@/components/providers/providers';
import { ClerkProvider } from '@clerk/nextjs';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { extractRouterConfig } from 'uploadthing/server';

import { ourFileRouter } from './api/uploadthing/core';
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
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
