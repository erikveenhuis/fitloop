import { useState, useRef, useEffect } from 'react'
import CameraCapture from './components/CameraCapture'
import ClothingGrid from './components/ClothingGrid'
import ClothingUploader from './components/ClothingUploader'
import { tryOnClothing } from './services/tryonAPI'
import { getClothingByCategory } from './utils/imageUtils'

const CATEGORIES = [
  { id: 'shirts', name: 'T-Shirts', icon: '👕' }
]

function App() {
  const [selectedClothing, setSelectedClothing] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('shirts')
  const [tryOnResult, setTryOnResult] = useState(null)
  const [capturedInput, setCapturedInput] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('camera') // 'camera', 'input', 'output'
  const [countdown, setCountdown] = useState(null) // null or number (3, 2, 1)
  const [uploadedClothing, setUploadedClothing] = useState([]) // User uploaded clothing items
  const [allClothingItems, setAllClothingItems] = useState([])
  const cameraRef = useRef(null)

  // Load default images from /public/default folder on mount
  useEffect(() => {
    const defaultImages = [
      { id: 'default-1', name: 'Outfit 1', path: '/default/WhatsApp Image 2025-10-20 at 19.08.35.jpeg', isUploaded: true },
      { id: 'default-2', name: 'Outfit 2', path: '/default/WhatsApp Image 2025-10-20 at 19.08.36.jpeg', isUploaded: true },
      { id: 'default-3', name: 'Outfit 3', path: '/default/WhatsApp Image 2025-10-20 at 19.08.36 (1).jpeg', isUploaded: true },
      { id: 'default-4', name: 'Outfit 4', path: '/default/WhatsApp Image 2025-10-20 at 19.08.36 (2).jpeg', isUploaded: true }
    ]
    setUploadedClothing(defaultImages)
  }, [])

  // Merge uploaded items with default items
  useEffect(() => {
    const defaultItems = getClothingByCategory(selectedCategory)
    setAllClothingItems([...uploadedClothing, ...defaultItems])
  }, [uploadedClothing, selectedCategory])

  const handleClothingSelect = async (clothing) => {
    setSelectedClothing(clothing)
    setViewMode('camera')
    // Don't auto-process, wait for user to click Try On
  }

  const handleClothingUpload = (newClothing) => {
    setUploadedClothing(prev => [...prev, newClothing])
    // Auto-select the newly uploaded item
    setSelectedClothing(newClothing)
    setViewMode('camera')
  }

  const handleDeleteClothing = (clothingId) => {
    setUploadedClothing(prev => prev.filter(item => item.id !== clothingId))
    // If the deleted item was selected, deselect it
    if (selectedClothing?.id === clothingId) {
      setSelectedClothing(null)
    }
  }

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory)
    setViewMode('camera')
    setTryOnResult(null)
    setCapturedInput(null)
  }

  // Keyboard navigation - Enter to try on
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && selectedClothing && !isLoading) {
        handleTryOn()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedClothing, isLoading])

  const processTryOn = async (clothing) => {
    if (!cameraRef.current) {
      setError('Camera not ready. Please allow camera access.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Capture current frame from camera
      const personImage = cameraRef.current.captureFrame()
      
      if (!personImage) {
        setError('Failed to capture image. Please try again.')
        return
      }

      // Store the captured input for comparison
      setCapturedInput(personImage)

      // Call the try-on API with category for better results
      const result = await tryOnClothing(personImage, clothing.path, selectedCategory)
      setTryOnResult(result)
      
      // Auto-switch to output view when result is ready
      setViewMode('output')
    } catch (err) {
      console.error('Try-on error:', err)
      setError(err.message || 'Failed to process try-on. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTryOn = async () => {
    if (selectedClothing) {
      // Start countdown
      setCountdown(3)
      setError(null)
      
      // Wait for countdown to finish
      await new Promise((resolve) => {
        let count = 3
        const interval = setInterval(() => {
          count--
          if (count > 0) {
            setCountdown(count)
          } else {
            setCountdown(null)
            clearInterval(interval)
            resolve()
          }
        }, 1000)
      })
      
      // Now capture and process
      await processTryOn(selectedClothing)
    }
  }

  const handleTryOnAll = async () => {
    if (uploadedClothing.length === 0) {
      setError('Please upload at least one clothing item to try on')
      return
    }

    // Start countdown
    setCountdown(3)
    setError(null)
    
    // Wait for countdown to finish
    await new Promise((resolve) => {
      let count = 3
      const interval = setInterval(() => {
        count--
        if (count > 0) {
          setCountdown(count)
        } else {
          setCountdown(null)
          clearInterval(interval)
          resolve()
        }
      }, 1000)
    })
    
    // Now capture and process all items
    await processTryOnMultiple(uploadedClothing)
  }

  const processTryOnMultiple = async (clothingItems) => {
    if (!cameraRef.current) {
      setError('Camera not ready. Please allow camera access or upload a photo.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Capture current frame from camera or uploaded image
      const personImage = cameraRef.current.captureFrame()
      
      if (!personImage) {
        setError('Failed to capture image. Please try again.')
        return
      }

      // Store the captured input for comparison
      setCapturedInput(personImage)

      // Call the try-on API with multiple clothing items
      const result = await tryOnClothing(personImage, clothingItems, selectedCategory, true)
      setTryOnResult(result)
      
      // Auto-switch to output view when result is ready
      setViewMode('output')
    } catch (err) {
      console.error('Try-on error:', err)
      setError(err.message || 'Failed to process try-on. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm shadow-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  FitLoop
                </h1>
                <p className="mt-1 text-sm text-purple-200">
                  Virtual Try-On Experience
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-blue-500/20 border border-blue-400/50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-blue-300">Accurate Mode</span>
              </div>
            </div>
            {selectedClothing && (
              <div className="text-right">
                <p className="text-sm text-purple-200">Currently Selected</p>
                <p className="text-lg font-semibold text-white">{selectedClothing.name}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Camera/Result */}
          <div className="order-2 lg:order-1">
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/10 relative z-10">
              {/* View Mode Toggle Buttons */}
              {(capturedInput || tryOnResult) && (
                <div className="mb-4 flex gap-2 justify-center">
                  <button
                    onClick={() => setViewMode('camera')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === 'camera'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    📷 Camera
                  </button>
                  {capturedInput && (
                    <button
                      onClick={() => setViewMode('input')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === 'input'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      📸 Input
                    </button>
                  )}
                  {tryOnResult && (
                    <button
                      onClick={() => setViewMode('output')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === 'output'
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      ✨ Output
                    </button>
                  )}
                </div>
              )}

              {/* Display based on view mode */}
              <div className="space-y-4 relative">
                {viewMode === 'camera' && (
                  <CameraCapture ref={cameraRef} />
                )}
                
                {viewMode === 'input' && capturedInput && (
                  <div className="relative">
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium z-10">
                      Input Image
                    </div>
                    <img
                      src={capturedInput}
                      alt="Captured input"
                      className="w-full rounded-2xl aspect-[3/4] object-contain bg-black"
                    />
                  </div>
                )}
                
                {viewMode === 'output' && tryOnResult && (
                  <div className="relative">
                    <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium z-10">
                      AI Result
                    </div>
                    <img
                      src={tryOnResult}
                      alt="Try-on result"
                      className="w-full rounded-2xl aspect-[3/4] object-contain bg-black"
                    />
                  </div>
                )}

                {/* Countdown Overlay */}
                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl z-30">
                    <div className="text-center">
                      <div className="text-9xl font-bold text-white animate-pulse">
                        {countdown}
                      </div>
                      <p className="mt-4 text-2xl text-purple-200 font-medium">
                        Get ready! 📸
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl z-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
                    <p className="mt-6 text-white font-medium text-lg">
                      ✨ Creating your virtual try-on...
                    </p>
                    <p className="mt-2 text-purple-200 text-sm">Using accurate mode • 15-30 seconds</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-blue-400 text-xs">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Garment Preservation</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Try On Buttons */}
              {!isLoading && (
                <div className="mt-4 space-y-3">
                  {/* Try On Selected Item */}
                  {selectedClothing && (
                    <>
                      <div className="text-center text-sm text-purple-200">
                        Selected: <span className="font-semibold text-white">{selectedClothing.name}</span>
                      </div>
                      <button
                        onClick={handleTryOn}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-105 transform flex items-center justify-center gap-2"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                        Apply This Item
                      </button>
                    </>
                  )}

                  {/* Try On All Items */}
                  {uploadedClothing.length > 0 && (
                    <>
                      {selectedClothing && (
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="bg-black/40 px-2 text-purple-300">or</span>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={handleTryOnAll}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/50 hover:shadow-xl hover:scale-105 transform flex items-center justify-center gap-2"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Try On All {uploadedClothing.length} Item{uploadedClothing.length !== 1 ? 's' : ''} (Complete Outfit)
                      </button>
                    </>
                  )}
                  
                  {/* Prompt when no clothing */}
                  {uploadedClothing.length === 0 && !selectedClothing && (
                    <div className="text-center p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl">
                      <p className="text-purple-200 text-sm">
                        👉 Upload clothing items from the right to create an outfit
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-red-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-white text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Clothing Grid & Upload */}
          <div className="order-1 lg:order-2">
            <div className="bg-black/30 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/10 sticky top-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-4xl">👕</span>
                <h2 className="text-2xl font-bold text-white">
                  Your Wardrobe
                </h2>
              </div>
              
              {/* Upload Section */}
              <ClothingUploader onUpload={handleClothingUpload} />
              
              {/* Show items count */}
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-purple-200">
                  {allClothingItems.length} item{allClothingItems.length !== 1 ? 's' : ''} total
                </span>
                {uploadedClothing.length > 0 && (
                  <span className="inline-flex items-center gap-1 bg-green-500/20 border border-green-400/30 px-3 py-1 rounded-full text-green-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {uploadedClothing.length} custom
                  </span>
                )}
              </div>
              
              {/* Clothing Grid */}
              <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-white/10">
                <ClothingGrid
                  items={allClothingItems}
                  selectedItem={selectedClothing}
                  onItemSelect={handleClothingSelect}
                  onItemDelete={handleDeleteClothing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 col-span-1 lg:col-span-2">
          <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-blue-100 text-sm">
                <strong className="text-white">Quick Tips:</strong> Position yourself in portrait view (vertical) for best results • Click any clothing item to select it • Click "Try On This Item" to see the accurate result in ~15-30 seconds • Press Enter as a shortcut
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

