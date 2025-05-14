import { Link } from 'react-router-dom'
import { CartItem as CartItemType } from '../../types'
import { useCart } from '../../context/CartContext'

interface CartItemProps {
  item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateCartItemQuantity, removeCartItem } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateCartItemQuantity(item.product_id, item.color, item.size, newQuantity)
    }
  }

  const handleRemove = () => {
    removeCartItem(item.product_id, item.color, item.size)
  }

  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="flex-shrink-0 sm:w-24 sm:h-24 overflow-hidden rounded-md">
        <Link to={`/products/${item.slug}`}>
          {item.product_image ? (
            <img
              src={item.product_image}
              alt={item.product_name}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <i className="fas fa-tshirt text-xl text-gray-400"></i>
            </div>
          )}
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col sm:flex-row sm:ml-6 mt-4 sm:mt-0">
        <div className="flex-1">
          <Link to={`/products/${item.slug}`} className="text-lg font-medium text-gray-900 hover:text-indigo-600">
            {item.product_name}
          </Link>
          
          {/* Variant Details */}
          <div className="mt-1 text-sm text-gray-500">
            {item.color && (
              <p>Color: <span className="font-medium">{item.color}</span></p>
            )}
            
            {item.size && (
              <p>Size: <span className="font-medium">{item.size}</span></p>
            )}
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="flex flex-col sm:items-end mt-4 sm:mt-0">
          <p className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
          
          <div className="mt-2 flex items-center">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1 text-gray-500 hover:text-gray-600"
            >
              <i className="fas fa-minus"></i>
            </button>
            <span className="mx-2 text-gray-700">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 text-gray-500 hover:text-gray-600"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <i className="fas fa-trash-alt mr-1"></i>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
