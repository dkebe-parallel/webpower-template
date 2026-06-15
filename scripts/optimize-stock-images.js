const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const CONFIGS = [
  { folder: 'hero',     maxWidth: 1600 },
  { folder: 'why-us',  maxWidth: 1200 },
  { folder: 'services', maxWidth: 900  },
]
const VERTICAL   = 'plombier'
const QUALITY    = 82
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images', 'stock', VERTICAL)
const BACKUP_DIR = path.join(process.cwd(), 'assets-source', 'stock-originals', VERTICAL)

async function main() {
  console.log('\n🖼  Optimizing stock images (PNG → WebP)\n')

  for (const { folder, maxWidth } of CONFIGS) {
    const srcDir    = path.join(PUBLIC_DIR, folder)
    const backupDir = path.join(BACKUP_DIR, folder)

    fs.mkdirSync(backupDir, { recursive: true })

    const pngs = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'))
    if (pngs.length === 0) {
      console.log(`  ${folder}/  — no PNGs found, skipping`)
      continue
    }

    console.log(`  ${folder}/  (max ${maxWidth}px)`)

    for (const png of pngs) {
      const srcPath    = path.join(srcDir, png)
      const webpName   = png.replace(/\.png$/, '.webp')
      const destPath   = path.join(srcDir, webpName)
      const backupPath = path.join(backupDir, png)

      // Convert
      const info = await sharp(srcPath)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(destPath)

      const sizeBefore = Math.round(fs.statSync(srcPath).size / 1024)
      const sizeAfter  = Math.round(info.size / 1024)

      // Move original to backup
      fs.renameSync(srcPath, backupPath)

      console.log(`    ${png.padEnd(20)} ${String(sizeBefore).padStart(5)} KB  →  ${webpName}  ${String(sizeAfter).padStart(4)} KB  (${Math.round((1 - sizeAfter/sizeBefore)*100)}% smaller)`)
    }
  }

  console.log('\n✅ Done. Originals moved to assets-source/stock-originals/\n')
}

main().catch(err => { console.error(err); process.exit(1) })
