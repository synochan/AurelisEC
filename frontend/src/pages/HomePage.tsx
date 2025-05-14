import React from 'react'
import Hero from '../components/Home/Hero'
import Featured from '../components/Home/Featured'

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Featured />
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Shop By Category</h2>
          <p className="mt-2 text-gray-600">Find exactly what you're looking for</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Men's Category */}
          <div className="relative group overflow-hidden rounded-lg">
            <img 
              src="https://pixabay.com/get/g43185846068122e81fdbb35e0df46774533d8b282bf1cb0846be6fca5655c2d42f3c2a21529999a10f6036d19b01a66a_1280.jpg" 
              alt="Men's Collection" 
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Men's Collection</h3>
                <a 
                  href="/products?category=men" 
                  className="inline-block bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
          
          {/* Women's Category */}
          <div className="relative group overflow-hidden rounded-lg">
            <img 
              src="https://pixabay.com/get/gb146524ed2d99c81d2f4ec303dc6bf494fe60db967842c066c046bcf96119fcd97e4835a662ef03bd5b43f4f1a877a93b11a303036dfd23b64af12fd28712afe_1280.jpg" 
              alt="Women's Collection" 
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Women's Collection</h3>
                <a 
                  href="/products?category=women" 
                  className="inline-block bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
          
          {/* Accessories Category */}
          <div className="relative group overflow-hidden rounded-lg">
            <img 
              src="https://pixabay.com/get/g1bea85bbf3a78b007ee7f42fa1742fa6c01ada307f1178a2e6a84ea1eeb5d0e1cd75bdd11475c5046b33e8bafe027a3ef661b243446f7f6eb74cae45c82a3680_1280.jpg" 
              alt="Accessories" 
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Accessories</h3>
                <a 
                  href="/products?category=accessories" 
                  className="inline-block bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-6">
            Sign up for our newsletter to receive updates on new arrivals, special offers, and exclusive content.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
          
          <p className="mt-4 text-sm text-gray-500">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </section>
      
      {/* Instagram Feed */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Follow Us on Instagram</h2>
          <p className="mt-2 text-gray-600">@fashiontrend</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <div className="aspect-square overflow-hidden">
            <img
              src="https://pixabay.com/get/gf96b79b4a9a5524169486fa3ffb1245c53a7aeb699dce787e16d5c1377004f809213f6c3f8ce8b318e7513e22d17571e41f64ffe2817c0516afe5cbfbb9148d0_1280.jpg"
              alt="Instagram post"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square overflow-hidden">
            <img
              src="https://pixabay.com/get/g4630786035d7cc9e8aa3f8185d13f2db00aeca00687273e9e1209a55fa37ab7df9611f6a30ba7a84409a5b8a4aa23e5a4cf534ae26208447a06f5428b3462295_1280.jpg"
              alt="Instagram post"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square overflow-hidden">
            <img
              src="https://pixabay.com/get/g7ba80cb33c486af14c370d913824d5332fb38afb645cc11afcf33f9f41e6dbe4f3dfc680646926ddf1b442746ad0ab1ed822e1ebaa5d9c118e1e20bd093ce877_1280.jpg"
              alt="Instagram post"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square overflow-hidden">
            <img
              src="https://pixabay.com/get/g91eaeec875d242b68d3604561a6dc732ffe350c1a1e7f62df98fed77fd2dd27de5e3eec4391e56e86b1c957fbf346cd113868197c701d2ae2ef025ef189b248d_1280.jpg"
              alt="Instagram post"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square overflow-hidden">
            <img
              src="https://pixabay.com/get/ga8ae22061f96910835ff8d0e35dc10bb474830927dd5acb683d6b765b2d772da905a6ade6fccdeec659114e5b057374cc766eee551f7dd53a9dc8aedd69e7386_1280.jpg"
              alt="Instagram post"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square overflow-hidden">
            <img
              src="https://pixabay.com/get/g5979e6cde76d672ef73add14d475c347cce88e0b2e1e992077863e5588d7a34307f3971c279c12dee9ba4dbe89947b7ccdb118eaa00fb3c1e5c800c11356caf7_1280.jpg"
              alt="Instagram post"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
