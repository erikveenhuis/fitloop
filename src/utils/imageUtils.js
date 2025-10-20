// Clothing database - maps to files in public/clothing directory
const CLOTHING_DATABASE = {
  shirts: [
    { id: 'shirt-1', name: 'Classic White Tee', path: '/clothing/shirts/white.jpg' },
    { id: 'shirt-2', name: 'Black Essential', path: '/clothing/shirts/black.jpg' },
    { id: 'shirt-3', name: 'Navy Blue Crew', path: '/clothing/shirts/navy.jpg' },
    { id: 'shirt-4', name: 'Grey Athletic', path: '/clothing/shirts/gray.jpg' },
    { id: 'shirt-5', name: 'Dark Blue Tee', path: '/clothing/shirts/darkblue.jpg' },
    { id: 'shirt-6', name: 'Light Blue Casual', path: '/clothing/shirts/lightblue.jpg' },
    { id: 'shirt-7', name: 'Green Crew Neck', path: '/clothing/shirts/green.jpg' },
    { id: 'shirt-8', name: 'Purple Premium', path: '/clothing/shirts/purple.jpg' },
    { id: 'shirt-9', name: 'Red Statement', path: '/clothing/shirts/red.jpg' },
    { id: 'shirt-10', name: 'Orange Bold', path: '/clothing/shirts/orange.jpg' },
    { id: 'shirt-11', name: 'Pink Soft', path: '/clothing/shirts/pink.jpg' },
    { id: 'shirt-12', name: 'Yellow Bright', path: '/clothing/shirts/yellow.jpg' }
  ]
}

export function getClothingByCategory(category) {
  return CLOTHING_DATABASE[category] || []
}

export function getAllClothing() {
  return Object.values(CLOTHING_DATABASE).flat()
}

export function getClothingById(id) {
  const allClothing = getAllClothing()
  return allClothing.find(item => item.id === id)
}

// Helper function to convert image to base64
export async function imageToBase64(imagePath) {
  try {
    const response = await fetch(imagePath)
    const blob = await response.blob()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error converting image to base64:', error)
    throw error
  }
}

// Helper function to resize image
export function resizeImage(base64Image, maxWidth = 1024, maxHeight = 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.onerror = reject
    img.src = base64Image
  })
}

