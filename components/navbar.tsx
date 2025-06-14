"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, LogOut, Shield, User, Calendar } from "lucide-react"

type AppUser = {
  id: number
  username: string
  role: string
  name: string
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [buildingName, setBuildingName] = useState("J02 Building")
  const [user, setUser] = useState<AppUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Fetch the building name on the client side
  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.buildingName) {
          setBuildingName(data.buildingName)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch building name:", err)
      })
  }, [])

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) {
            setUser(data.user)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        // User is not authenticated
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [pathname]) // Re-check auth when pathname changes

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      // Force a reload to update everything
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">{buildingName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About Us
          </Link>
          <Link href="/for-sale" className="text-sm font-medium transition-colors hover:text-primary">
            For Sale
          </Link>
          <Link href="/news" className="text-sm font-medium transition-colors hover:text-primary">
            News
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
          <Link href="/visitors" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
            <User className="mr-1 h-4 w-4" />
            Visitors
          </Link>
          <Link
            href="/amenity-bookings"
            className="flex items-center text-sm font-medium transition-colors hover:text-primary"
          >
            <Calendar className="mr-1 h-4 w-4" />
            Amenities
          </Link>

          {/* Authentication-based navigation */}
          {!authLoading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm font-medium">
                    {user.role === "admin" ? (
                      <Shield className="mr-1 h-4 w-4 text-blue-600" />
                    ) : (
                      <User className="mr-1 h-4 w-4 text-green-600" />
                    )}
                    <span>{user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center">
                    <LogOut className="mr-1 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  <LogIn className="mr-1 h-4 w-4" />
                  Log In
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col space-y-4 py-4">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary" onClick={toggleMenu}>
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              href="/for-sale"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              For Sale
            </Link>
            <Link
              href="/news"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              News
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <Link
              href="/visitors"
              className="flex items-center text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              <User className="mr-1 h-4 w-4" />
              Visitors
            </Link>
            <Link
              href="/amenity-bookings"
              className="flex items-center text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              <Calendar className="mr-1 h-4 w-4" />
              Amenities
            </Link>

            {/* Mobile Authentication */}
            {!authLoading && (
              <>
                {user ? (
                  <>
                    <div className="flex items-center text-sm font-medium">
                      {user.role === "admin" ? (
                        <Shield className="mr-1 h-4 w-4 text-blue-600" />
                      ) : (
                        <User className="mr-1 h-4 w-4 text-green-600" />
                      )}
                      <span>{user.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                      <LogOut className="mr-1 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                    onClick={toggleMenu}
                  >
                    <LogIn className="mr-1 h-4 w-4" />
                    Log In
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
