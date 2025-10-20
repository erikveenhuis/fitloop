import { useState, useEffect } from 'react'
import { getClothingByCategory } from '../utils/imageUtils'

const CATEGORIES = [
  { id: 'shirts', name: 'Shirts', icon: '👕' },
  { id: 'pants', name: 'Pants', icon: '👖' },
  { id: 'jackets', name: 'Jackets', icon: '🧥' },
  { id: 'dresses', name: 'Dresses', icon: '👗' }
]

function ClothingSelector({ selectedCategory, onCategoryChange, onClothingSelect, selectedClothing }) {
  const [clothingItems, setClothingItems] = useState([])

  useEffect(() => {
    // Load clothing items for selected category
    const items = getClothingByCategory(selectedCategory)
    setClothingItems(items)
  }, [selectedCategory])

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Clothing Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {clothingItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No clothing items available</p>
            <p className="text-sm">Add images to the public/clothing/{selectedCategory} folder</p>
          </div>
        ) : (
          clothingItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onClothingSelect(item)}
              className={`group relative aspect-square rounded-lg overflow-hidden border-4 transition-all duration-200 ${
                selectedClothing?.id === item.id
                  ? 'border-purple-600 shadow-lg scale-105'
                  : 'border-transparent hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <img
                src={item.path}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-medium text-sm truncate">
                    {item.name}
                  </p>
                </div>
              </div>
              {selectedClothing?.id === item.id && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default ClothingSelector

