"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, UserPlus } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [buildingName, setBuildingName] = useState("J02 Building")

  // Fetch the building name on the client side
  useEffect(() => {
    // This is a workaround to access env vars in client components
    // In a real app, you might want to use an API route or pass this as a prop
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
            <UserPlus className="mr-1 h-4 w-4" />
            Visitors
          </Link>
          <Link href="/login" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
            <LogIn className="mr-1 h-4 w-4" />
            Log In
          </Link>
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
              <UserPlus className="mr-1 h-4 w-4" />
              Visitors
            </Link>
            <Link
              href="/login"
              className="flex items-center text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              <LogIn className="mr-1 h-4 w-4" />
              Log In
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
