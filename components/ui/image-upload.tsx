'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export type UploadedImage = {
  filename: string
  url: string
  size: number
  mimeType: string
  originalName: string
}

type ImageUploadProps = {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxFiles?: number
}

export function ImageUpload({
  images,
  onImagesChange,
  maxFiles = 10,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxFiles) {
        setUploadError(`Maximum ${maxFiles} images allowed`)
        return
      }

      setIsUploading(true)
      setUploadError(null)

      try {
        const formData = new FormData()
        acceptedFiles.forEach((file) => {
          formData.append('files', file)
        })

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()

        if (data.errors && data.errors.length > 0) {
          setUploadError(data.errors[0].error)
        }

        if (data.images && data.images.length > 0) {
          onImagesChange([...images, ...data.images])
        }
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError('Failed to upload images')
      } finally {
        setIsUploading(false)
      }
    },
    [images, onImagesChange, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading || images.length >= maxFiles,
  })

  const removeImage = (filename: string) => {
    onImagesChange(images.filter((img) => img.filename !== filename))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 dark:text-blue-400">Drop images here...</p>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Drag & drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              PNG, JPG, WEBP up to 5MB ({images.length}/{maxFiles})
            </p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
          <p className="text-sm text-red-800 dark:text-red-400">{uploadError}</p>
        </div>
      )}

      {isUploading && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Uploading images...
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.filename}
              className="relative group aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
            >
              <Image
                src={image.url}
                alt={image.originalName}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(image.filename)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !isUploading && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}
