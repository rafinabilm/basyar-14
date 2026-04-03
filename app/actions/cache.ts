"use server"

import { revalidatePath } from 'next/cache'

export async function purgeAppCache() {
  // Purge the home page cache
  revalidatePath('/', 'page')
  // Purge the kas page cache
  revalidatePath('/kas', 'page')
  // Purge the entire layout tree to safely trigger PWA updates
  revalidatePath('/', 'layout')
}
