"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Clock, Bell, User, Settings, LogOut, Menu, X } from "lucide-react"

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate() // Correctly use useNavigate

  const handleLogout = () => {
    // Handle logout logic here (e.g., clear user data)
    // Example: clear user data from local storage or context
    localStorage.removeItem("user") // Clear user data
    navigate("/login") // Redirect to login page
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary">DigiQueue</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/book-slot" className="text-sm font-medium hover:text-primary transition-colors">
            Book Slot
          </Link>
          <Link to="/my-bookings" className="text-sm font-medium hover:text-primary transition-colors">
            My Bookings
          </Link>
         {/* ✅ Notifications with Badge */}
  <Link to="/notifications" className="relative text-sm font-medium hover:text-primary transition-colors">
    Notifications
    <span className="absolute -top-2 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white text-xs shadow-sm">
      3
    </span>
  </Link>
</nav>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
         <Button
  variant="ghost"
  size="icon"
  className="relative hidden md:flex"
  aria-label="Notifications"
>
  <Bell className="h-5 w-5 text-gray-800" />
  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white text-xs shadow">
    3
  </span>
</Button>


          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User  Menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="User " />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User  className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Mobile Menu">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <Link to="/dashboard" className="block text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link to="/book-slot" className="block text-sm font-medium hover:text-primary">
              Book Slot
            </Link>
            <Link to="/my-bookings" className="block text-sm font-medium hover:text-primary">
              My Bookings
            </Link>
            <Link to="/notifications" className="block text-sm font-medium hover:text-primary">
              Notifications
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
