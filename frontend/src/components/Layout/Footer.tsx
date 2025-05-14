import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">FashionTrend</h3>
            <p className="text-gray-300 mb-4">
              Discover the latest fashion trends and shop your favorite styles. Quality apparel for every occasion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-pinterest"></i>
                <span className="sr-only">Pinterest</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white">All Products</Link>
              </li>
              <li>
                <Link to="/products?category=men" className="text-gray-300 hover:text-white">Men</Link>
              </li>
              <li>
                <Link to="/products?category=women" className="text-gray-300 hover:text-white">Women</Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-gray-300 hover:text-white">Accessories</Link>
              </li>
              <li>
                <Link to="/products?category=sale" className="text-gray-300 hover:text-white">Sale</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Size Guide</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {currentYear} FashionTrend. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
