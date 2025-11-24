import axios from 'axios'

// Backend API URL - use relative path in production
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

// Note: This now uses a backend server to handle Replicate API calls
// This avoids CORS issues and keeps your API key secure

export async function tryOnClothing(personImageBase64, clothingImagePathOrItems, category = 'shirts') {
  console.log('Starting virtual try-on process...')

  try {
    // Ensure we always have an array of clothing items
    const clothingItems = Array.isArray(clothingImagePathOrItems) 
      ? clothingImagePathOrItems 
      : [{ path: clothingImagePathOrItems, name: category }]
    
    console.log(`Processing ${clothingItems.length} clothing items...`)
    
    // Fetch all clothing images
    const clothingImages = await Promise.all(
      clothingItems.map(async (item) => {
        const blob = await fetch(item.path).then(r => r.blob())
        const dataUri = await blobToDataUri(blob)
        return {
          name: item.name || category,
          image: dataUri
        }
      })
    )

    console.log('Person image size:', personImageBase64.length)
    console.log('Clothing items:', clothingImages.length)

    // Call our backend API (nano banana pro)
    console.log('Calling backend API for outfit (nano banana pro)...')
    const response = await axios.post(
      `${API_URL}/tryon-multiple`,
      {
        personImage: personImageBase64,
        clothingImages: clothingImages,
        category: category
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('API Response:', response.data)

    // Check if we got a direct result (status: 'succeeded' with output)
    if (response.data.status === 'succeeded' && response.data.output) {
      console.log('Received direct result:', response.data.output)
      return response.data.output
    }
    
    // Otherwise, get the prediction ID and poll for the result
    const predictionId = response.data.predictionId
    console.log('Prediction ID:', predictionId)
    
    // Poll for the result
    const result = await pollForResult(predictionId)
    
    return result
  } catch (error) {
    console.error('Try-on API error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    
    // Provide more specific error messages
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Backend server not running. Please start it with: npm run start')
    } else if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your Replicate API key in .env file.')
    } else if (error.response?.status === 402) {
      throw new Error('No API credits available. Please add credits to your Replicate account.')
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    } else if (error.response?.data?.error) {
      throw new Error(`API Error: ${error.response.data.error}`)
    } else {
      throw new Error(error.message || 'Failed to process virtual try-on. Check console for details.')
    }
  }
}

async function pollForResult(predictionId, maxAttempts = 60) {
  console.log('Polling for result...')
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await axios.get(`${API_URL}/tryon/${predictionId}`)

      const status = response.data.status
      console.log(`Poll attempt ${i + 1}/${maxAttempts}, Status: ${status}`)

      if (status === 'succeeded') {
        console.log('Processing succeeded!')
        console.log('Output:', response.data.output)
        // Return the output image URL
        return response.data.output
      } else if (status === 'failed') {
        console.error('Processing failed:', response.data.error)
        throw new Error(`Processing failed: ${response.data.error || 'Unknown error'}`)
      }

      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error('Polling error:', error)
      if (error.message.includes('failed')) {
        throw error
      }
      // Continue polling on network errors
    }
  }

  throw new Error('Processing timeout - try-on took too long')
}

function blobToDataUri(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
