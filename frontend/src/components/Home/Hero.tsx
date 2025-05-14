import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://pixabay.com/get/g8600b22b94d26cc0c4b05e4e471cc260977c4ce5becc4cd1db138de5d85e8f95010785a212df4629f1b9dc778cd94bc5a6681b7fcdb94bf85588923e04f0d6ee_1280.jpg')",
            opacity: 0.7,
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Style Redefined for Every Season
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl">
            Discover the latest trends in fashion. Shop our new arrivals and find your perfect style for any occasion.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 md:text-lg"
            >
              Shop Now
            </Link>
            <Link
              to="/products?category=sale"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-black md:text-lg transition-colors duration-200"
            >
              View Sale
            </Link>
          </div>
          
          <div className="mt-6 inline-block">
            <span className="bg-white text-black text-xs font-medium px-3 py-1.5 rounded-full">
              Powered by TanStack Query for optimized data fetching
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
