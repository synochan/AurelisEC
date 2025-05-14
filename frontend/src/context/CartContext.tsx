import { createContext, useState, useContext, useEffect } from 'react'
import { CartItem } from '../types'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  updateCartItemQuantity: (productId: number, color: string, size: string, quantity: number) => void
  removeCartItem: (productId: number, color: string, size: string) => void
  clearCart: () => void
  calculateCartTotal: () => number
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  updateCartItemQuantity: () => {},
  removeCartItem: () => {},
  clearCart: () => {},
  calculateCartTotal: () => 0
})

export const useCart = () => useContext(CartContext)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load cart items from localStorage on component mount
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCartItems = localStorage.getItem('cartItems')
    return savedCartItems ? JSON.parse(savedCartItems) : []
  })
  
  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])
  
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart (same product, color, and size)
      const existingItemIndex = prevItems.findIndex(
        i => i.product_id === item.product_id && i.color === item.color && i.size === item.size
      )
      
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const newItems = [...prevItems]
        newItems[existingItemIndex].quantity += item.quantity
        return newItems
      } else {
        // Otherwise, add the new item
        return [...prevItems, item]
      }
    })
  }
  
  const updateCartItemQuantity = (productId: number, color: string, size: string, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product_id === productId && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }
  
  const removeCartItem = (productId: number, color: string, size: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.product_id === productId && item.color === color && item.size === size)
      )
    )
  }
  
  const clearCart = () => {
    setCartItems([])
  }
  
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateCartItemQuantity,
      removeCartItem,
      clearCart,
      calculateCartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}
