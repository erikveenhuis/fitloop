export default function ClothingGrid({ items, selectedItem, onItemSelect, onItemDelete }) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/50">
        <p>Upload clothing items to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemSelect(item)}
          className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
            selectedItem?.id === item.id
              ? 'ring-4 ring-purple-500 shadow-xl shadow-purple-500/50 scale-105'
              : 'ring-2 ring-white/20 hover:ring-purple-400 hover:scale-105'
          }`}
        >
          {/* Image */}
          <img
            src={item.path}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay with name */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white font-medium text-sm truncate">{item.name}</p>
            </div>
          </div>

          {/* Selected Badge */}
          {selectedItem?.id === item.id && (
            <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Selected
            </div>
          )}

          {/* Custom Badge */}
          {item.isUploaded && !selectedItem?.id === item.id && (
            <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
              Custom
            </div>
          )}

          {/* Delete Button */}
          {item.isUploaded && onItemDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete "${item.name}"?`)) {
                  onItemDelete(item.id)
                }
              }}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
              title="Delete this item"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

