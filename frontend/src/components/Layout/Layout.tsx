import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation()

  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
