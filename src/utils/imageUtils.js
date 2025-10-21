// Clothing database - empty by default, users upload their own clothing
const CLOTHING_DATABASE = {
  shirts: []
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

