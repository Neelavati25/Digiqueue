"use client"

import { useState } from "react"
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button"
import { Menu, X, Clock } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
    {/* Logo */}
    <Link to="/" className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
        <Clock className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold gradient-text">DigiQueue</span>
    </Link>

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
      <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
      <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
    </nav>

    {/* Desktop Buttons */}
    <div className="hidden md:flex items-center space-x-4">
      <Link to="/user/login">
        <Button variant="ghost" className="hover:bg-violet-600/30" aria-label="Login">
          Login
        </Button>
      </Link>
      <Link to="/user/signup">
        <Button className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-primary/90 hover:to-purple-600/90" aria-label="Get Started">
          Get Started
        </Button>
      </Link>
    </div>

    {/* Mobile Menu Button */}
    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Mobile Menu">
      {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  </div>

  {/* Mobile Menu */}
  {isMenuOpen && (
    <div className="md:hidden border-t bg-background/95 backdrop-blur">
      <div className="container py-4 space-y-4 px-4">
        <Link to="/" className="block text-sm font-medium hover:text-primary">Home</Link>
        <Link to="/about" className="block text-sm font-medium hover:text-primary">About</Link>
        <Link to="/contact" className="block text-sm font-medium hover:text-primary">Contact</Link>
        <div className="flex flex-col space-y-2 pt-4">
          <Link to="/user/login">
            <Button variant="ghost" className="w-full" aria-label="Login">Login</Button>
          </Link>
          <Link to="/user/signup">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600" aria-label="Get Started">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )}
</header>

  )
}
