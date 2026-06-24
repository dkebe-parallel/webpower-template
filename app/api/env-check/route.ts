import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    airtableKey: !!process.env.AIRTABLE_API_KEY,
    airtableBase: !!process.env.AIRTABLE_BASE_ID,
    airtableKeyPrefix: process.env.AIRTABLE_API_KEY?.slice(0, 8) ?? 'missing',
    airtableBasePrefix: process.env.AIRTABLE_BASE_ID?.slice(0, 6) ?? 'missing',
  })
}
