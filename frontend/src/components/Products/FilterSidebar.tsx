import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories } from '../../utils/api'
import { Category } from '../../types'

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: searchParams.get('price_min') || '',
    max: searchParams.get('price_max') || ''
  })
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '')
  const [inStock, setInStock] = useState<boolean>(searchParams.get('in_stock') === 'true')
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort_by') || 'name')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    loadCategories()
  }, [])

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPriceRange(prev => ({ ...prev, [name]: value }))
  }

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInStock(e.target.checked)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)
    
    // Apply category filter
    if (selectedCategory) {
      params.set('category', selectedCategory)
    } else {
      params.delete('category')
    }
    
    // Apply price range filter
    if (priceRange.min) {
      params.set('price_min', priceRange.min)
    } else {
      params.delete('price_min')
    }
    
    if (priceRange.max) {
      params.set('price_max', priceRange.max)
    } else {
      params.delete('price_max')
    }
    
    // Apply in-stock filter
    if (inStock) {
      params.set('in_stock', 'true')
    } else {
      params.delete('in_stock')
    }
    
    // Apply sorting
    if (sortBy) {
      params.set('sort_by', sortBy)
    } else {
      params.delete('sort_by')
    }
    
    // Preserve search query if it exists
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      params.set('search', searchQuery)
    }
    
    setSearchParams(params)
  }

  const resetFilters = () => {
    setSelectedCategory('')
    setPriceRange({ min: '', max: '' })
    setInStock(false)
    setSortBy('name')
    
    // Preserve only search query if it exists
    const params = new URLSearchParams()
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      params.set('search', searchQuery)
    }
    
    setSearchParams(params)
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="category-all"
              name="category"
              type="radio"
              checked={selectedCategory === ''}
              onChange={() => handleCategoryChange('')}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="category-all" className="ml-3 text-sm text-gray-600">
              All Categories
            </label>
          </div>
          
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                id={`category-${category.slug}`}
                name="category"
                type="radio"
                checked={selectedCategory === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={`category-${category.slug}`} className="ml-3 text-sm text-gray-600">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="price-min" className="sr-only">
              Minimum Price
            </label>
            <input
              type="number"
              id="price-min"
              name="min"
              placeholder="Min"
              value={priceRange.min}
              onChange={handlePriceChange}
              min="0"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="price-max" className="sr-only">
              Maximum Price
            </label>
            <input
              type="number"
              id="price-max"
              name="max"
              placeholder="Max"
              value={priceRange.max}
              onChange={handlePriceChange}
              min="0"
              className="form-input"
            />
          </div>
        </div>
      </div>
      
      {/* In Stock */}
      <div>
        <div className="flex items-center">
          <input
            id="in-stock"
            name="in-stock"
            type="checkbox"
            checked={inStock}
            onChange={handleInStockChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="in-stock" className="ml-3 text-sm text-gray-600">
            In Stock Only
          </label>
        </div>
      </div>
      
      {/* Sort By */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Sort By</h3>
        <select
          id="sort-by"
          name="sort-by"
          value={sortBy}
          onChange={handleSortChange}
          className="form-input"
        >
          <option value="name">Name (A-Z)</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={applyFilters}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default FilterSidebar
