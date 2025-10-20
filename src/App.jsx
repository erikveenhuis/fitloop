import { useState, useRef, useEffect } from 'react'
import CameraCapture from './components/CameraCapture'
import ClothingCarousel from './components/ClothingCarousel'
import { tryOnClothing } from './services/tryonAPI'

const CATEGORIES = [
  { id: 'shirts', name: 'T-Shirts', icon: '👕' }
]

function App() {
  const [selectedClothing, setSelectedClothing] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('shirts')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tryOnResult, setTryOnResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const cameraRef = useRef(null)

  const handleClothingSelect = async (clothing) => {
    setSelectedClothing(clothing)
    setShowResult(false)
    // Don't auto-process, wait for user to click Try On
  }

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory)
    setCurrentIndex(0)
    setShowResult(false)
    setTryOnResult(null)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // Handled by carousel
      } else if (e.key === 'Enter' && selectedClothing && !isLoading) {
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

      // Call the try-on API with category for better results
      const result = await tryOnClothing(personImage, clothing.path, selectedCategory)
      setTryOnResult(result)
    } catch (err) {
      console.error('Try-on error:', err)
      setError(err.message || 'Failed to process try-on. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTryOn = async () => {
    if (selectedClothing) {
      setShowResult(true)
      await processTryOn(selectedClothing)
    }
  }

  const toggleView = () => {
    setShowResult(!showResult)
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
        {/* Main Content - Camera Center Stage with Carousel Around It */}
        <div className="relative">
          {/* Center - Camera/Result - Main Focus */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/10 relative z-10">
              {showResult && tryOnResult && !isLoading ? (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                    <img
                      src={tryOnResult}
                      alt="Try-on result"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={toggleView}
                        className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/70 transition-colors"
                      >
                        Show Camera
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <CameraCapture ref={cameraRef} />
                  {tryOnResult && (
                    <button
                      onClick={toggleView}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                    >
                      Show Result
                    </button>
                  )}
                </div>
              )}

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

              {/* Try On Button */}
              {selectedClothing && !isLoading && (
                <button
                  onClick={handleTryOn}
                  className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-105 transform"
                >
                  ✨ Try On This Item
                </button>
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

          {/* Clothing Carousel - Wrapping Around Camera */}
          <div className="bg-black/30 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/10 min-h-[400px]">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-4xl">👕</span>
              <h2 className="text-2xl font-bold text-white">
                Browse T-Shirts
              </h2>
            </div>
            <ClothingCarousel
              category={selectedCategory}
              onClothingSelect={handleClothingSelect}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6">
          <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-blue-100 text-sm">
                <strong className="text-white">Quick Tips:</strong> Position yourself in portrait view (vertical) for best results • Use arrow buttons or keyboard ← → to browse t-shirts • Click "Try On This Item" to see the accurate result in ~15-30 seconds • Press Enter as a shortcut
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

