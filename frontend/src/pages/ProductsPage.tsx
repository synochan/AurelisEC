import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductList from '../components/Products/ProductList'
import FilterSidebar from '../components/Products/FilterSidebar'

const ProductsPage = () => {
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  
  const categoryParam = searchParams.get('category')
  const searchQuery = searchParams.get('search')
  
  // Generate page title based on query parameters
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`
    }
    
    if (categoryParam) {
      // Capitalize category name
      const categoryName = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
      return `${categoryName} Collection`
    }
    
    return 'All Products'
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
        
        {/* Search Form */}
        <div className="max-w-md mx-auto mt-4">
          <form
            method="get"
            action="/products"
            className="flex"
            onSubmit={(e) => {
              // Prevent submitting an empty search
              const searchInput = e.currentTarget.search as HTMLInputElement
              if (!searchInput.value.trim()) {
                e.preventDefault()
              }
            }}
          >
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={searchQuery || ''}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
            >
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Mobile filter button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex justify-center items-center space-x-2 bg-gray-100 px-4 py-2 rounded"
          >
            <i className={`fas ${showFilters ? 'fa-times' : 'fa-filter'}`}></i>
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>
        
        {/* Filters sidebar - always visible on desktop, toggleable on mobile */}
        <div className={`md:w-64 md:block ${showFilters ? 'block' : 'hidden'} mb-6 md:mb-0 md:mr-8`}>
          <div className="sticky top-4">
            <FilterSidebar />
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <ProductList />
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
