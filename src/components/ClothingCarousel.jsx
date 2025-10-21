import { useState, useEffect } from 'react'
import { getClothingByCategory } from '../utils/imageUtils'

function ClothingCarousel({ category, uploadedItems = [], onClothingSelect, onDeleteClothing, currentIndex, setCurrentIndex }) {
  const [clothingItems, setClothingItems] = useState([])

  useEffect(() => {
    // Merge uploaded items with default items from category
    const defaultItems = getClothingByCategory(category)
    const allItems = [...uploadedItems, ...defaultItems]
    setClothingItems(allItems)
    if (allItems.length > 0 && currentIndex >= allItems.length) {
      setCurrentIndex(0)
    }
  }, [category, uploadedItems, currentIndex, setCurrentIndex])

  const goToPrevious = () => {
    if (clothingItems.length === 0) return
    const newIndex = currentIndex === 0 ? clothingItems.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    onClothingSelect(clothingItems[newIndex])
  }

  const goToNext = () => {
    if (clothingItems.length === 0) return
    const newIndex = currentIndex === clothingItems.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    onClothingSelect(clothingItems[newIndex])
  }

  const goToIndex = (index) => {
    setCurrentIndex(index)
    onClothingSelect(clothingItems[index])
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (clothingItems.length === 0) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clothingItems, currentIndex])

  if (clothingItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-300">No clothing items available</p>
      </div>
    )
  }

  const currentItem = clothingItems[currentIndex]
  const previousIndex = currentIndex === 0 ? clothingItems.length - 1 : currentIndex - 1
  const nextIndex = currentIndex === clothingItems.length - 1 ? 0 : currentIndex + 1

  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Previous Item - Left Side */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={goToPrevious}
          className="group flex flex-col items-center gap-2 p-4 hover:scale-110 transition-transform duration-200"
        >
          <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-300 group-hover:border-purple-400 transition-colors shadow-lg opacity-70 group-hover:opacity-100">
            <img
              src={clothingItems[previousIndex].path}
              alt={clothingItems[previousIndex].name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2 text-white/70 group-hover:text-purple-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Previous</span>
          </div>
        </button>
      </div>

      {/* Current Item - Center */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-8 border-purple-600 shadow-2xl group">
          <img
            src={currentItem.path}
            alt={currentItem.name}
            className="w-full h-full object-cover"
          />
          {/* Delete Button for Uploaded Items */}
          {currentItem.isUploaded && onDeleteClothing && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete "${currentItem.name}"?`)) {
                  onDeleteClothing(currentItem.id)
                }
              }}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              title="Delete this item"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          {/* Uploaded Badge */}
          {currentItem.isUploaded && (
            <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
              Custom
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white">{currentItem.name}</h3>
          <p className="text-sm text-purple-200 mt-1">
            {currentIndex + 1} of {clothingItems.length}
          </p>
        </div>

        {/* Dots Navigation */}
        <div className="flex gap-2 mt-2">
          {clothingItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-purple-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next Item - Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={goToNext}
          className="group flex flex-col items-center gap-2 p-4 hover:scale-110 transition-transform duration-200"
        >
          <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-300 group-hover:border-purple-400 transition-colors shadow-lg opacity-70 group-hover:opacity-100">
            <img
              src={clothingItems[nextIndex].path}
              alt={clothingItems[nextIndex].name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2 text-white/70 group-hover:text-purple-300">
            <span className="text-sm font-medium">Next</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-purple-300">
        Use arrow keys ← → or click to navigate
      </div>
    </div>
  )
}

export default ClothingCarousel

