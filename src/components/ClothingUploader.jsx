import { useState } from 'react'

export default function ClothingUploader({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    // Filter for image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      alert('Please upload image files only')
      return
    }

    // Convert each file to a data URL
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target.result
        onUpload({
          id: `upload-${Date.now()}-${Math.random()}`,
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          path: dataUrl,
          isUploaded: true
        })
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="mb-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-purple-400 bg-purple-500/20 scale-105'
            : 'border-white/30 bg-white/5 hover:border-purple-400/50 hover:bg-white/10'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl">📤</div>
          <div className="text-white">
            <p className="text-lg font-semibold mb-2">
              Upload Your Clothing Images
            </p>
            <p className="text-sm text-purple-200">
              Drag & drop images here or click to browse
            </p>
            <p className="text-xs text-purple-300/70 mt-1">
              Supports JPG, PNG, WEBP • Multiple files allowed
            </p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Choose Files
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

