import { getClothingByCategory, getAllClothing } from '../utils/imageUtils'

function RandomizerButton({ category, onRandomSelect }) {
  const handleRandomize = () => {
    // Get clothing items from current category or all categories
    const items = category === 'all' ? getAllClothing() : getClothingByCategory(category)
    
    if (items.length === 0) {
      return
    }

    // Select random item
    const randomIndex = Math.floor(Math.random() * items.length)
    const randomItem = items[randomIndex]
    
    onRandomSelect(randomItem)
  }

  return (
    <button
      onClick={handleRandomize}
      className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>Randomize</span>
    </button>
  )
}

export default RandomizerButton

