import React from 'react';

function CategoryChips({
  categories = [],
  selectedCategory = '',
  onSelectCategory = () => {},
}) {
  const isAllActive = !selectedCategory;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6" aria-label="Filter Kategori">
      <button
        type="button"
        onClick={() => onSelectCategory('')}
        className={`px-3.5 py-1.5 text-xs rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
          isAllActive
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 font-medium'
        }`}
      >
        Semua
      </button>

      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => (isActive ? onSelectCategory('') : onSelectCategory(category))}
            className={`px-3.5 py-1.5 text-xs rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 font-medium'
            }`}
          >
            {`#${category}`}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryChips;
