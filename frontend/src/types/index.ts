// User types
export interface UserProfile {
  phone_number?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  profile_picture?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  profile: UserProfile
}

// Product types
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

export interface ProductImage {
  id: number
  image: string
  alt_text?: string
  is_featured: boolean
}

export interface ProductVariant {
  id: number
  color: string
  size: string
  stock: number
  sku: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  image?: string
  featured_image?: ProductImage
  in_stock: boolean
  is_active: boolean
  created_at: string
  category: Category
  images?: ProductImage[]
  variants?: ProductVariant[]
}

// Cart types
export interface CartItem {
  product_id: number
  product_name: string
  product_image?: string
  price: number
  quantity: number
  color: string
  size: string
  slug: string
}

// Order types
export interface OrderItem {
  id: number
  product: Product
  price: number
  quantity: number
  color?: string
  size?: string
}

export interface Payment {
  id: number
  payment_method: string
  transaction_id?: string
  amount: number
  status: string
  created_at: string
}

export interface Order {
  id: number
  first_name: string
  last_name: string
  email: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  total_price: number
  status: string
  payment_id?: string
  created_at: string
  updated_at: string
  items: OrderItem[]
  payment?: Payment
}

// Form types
export interface LoginFormData {
  username: string
  password: string
}

export interface RegisterFormData {
  username: string
  email: string
  password: string
  password2: string
  first_name: string
  last_name: string
}

export interface ProfileFormData {
  first_name: string
  last_name: string
  profile: {
    phone_number?: string
    address?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
    date_of_birth?: string
  }
}

export interface PasswordFormData {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface CheckoutFormData {
  first_name: string
  last_name: string
  email: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
}
