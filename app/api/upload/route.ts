import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { saveImage, validateFile } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadedImages = []
    const errors = []

    for (const file of files) {
      const validation = validateFile(file)
      if (!validation.valid) {
        errors.push({ filename: file.name, error: validation.error })
        continue
      }

      try {
        const result = await saveImage(file)
        uploadedImages.push({
          filename: result.filename,
          url: result.url,
          size: result.size,
          mimeType: file.type,
          originalName: file.name,
        })
      } catch (error) {
        console.error('Error uploading file:', error)
        errors.push({
          filename: file.name,
          error: 'Failed to process image',
        })
      }
    }

    return NextResponse.json({
      images: uploadedImages,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
