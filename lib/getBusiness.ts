import fs from 'fs'
import path from 'path'
import { BusinessData } from './types'

export function getBusiness(slug: string): BusinessData | null {
  const filePath = path.join(process.cwd(), 'data', 'businesses', `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}
