export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { notFound } from 'next/navigation'
import { getBusiness } from '@/lib/getBusiness'
import CommanderClient from './CommanderClient'

interface PageProps {
  searchParams: Promise<{ slug?: string }>
}

export default async function CommanderPage({ searchParams }: PageProps) {
  const { slug } = await searchParams
  if (!slug) notFound()

  const data = getBusiness(slug)
  if (!data) notFound()

  return <CommanderClient data={data} slug={slug} />
}
