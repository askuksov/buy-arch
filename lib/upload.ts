import { writeFile, unlink } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads'
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function ensureUploadDir() {
  const uploadPath = path.join(process.cwd(), UPLOAD_DIR)
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true })
  }
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`,
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  return { valid: true }
}

export async function saveImage(file: File): Promise<{
  filename: string
  url: string
  size: number
}> {
  ensureUploadDir()

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const extension = file.type.split('/')[1]
  const filename = `${uuidv4()}.${extension}`
  const filepath = path.join(process.cwd(), UPLOAD_DIR, filename)

  await sharp(buffer)
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .png({ compressionLevel: 9 })
    .webp({ quality: 85 })
    .toFile(filepath)

  return {
    filename,
    url: `/uploads/${filename}`,
    size: buffer.length,
  }
}

export async function deleteImage(filename: string): Promise<void> {
  const filepath = path.join(process.cwd(), UPLOAD_DIR, filename)

  if (existsSync(filepath)) {
    await unlink(filepath)
  }
}

export function getFilenameFromUrl(url: string): string {
  return url.split('/').pop() || ''
}
