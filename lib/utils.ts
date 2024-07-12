import { type ClassValue, clsx } from 'clsx';
import { cache } from 'react';
import { twMerge } from 'tailwind-merge';
import { db } from './db';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getServer = cache(async (id: string) => {
  return await db.server.findUnique({ where: { id } });
});
