import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Home and Public Page
import HomePage from './app/Home'
import AboutPage from './app/about'
import ContactPage from './app/contact'

// User Authentication
import UserLoginPage from './app/user/login'
import UserSignupPage from './app/user/signup'

// User Dashboard and Features
import UserDashboardPage from './app/user/dashboard'
import UserBookSlotPage from './app/user/book-slot'
import UserMyBookingsPage from './app/user/my-bookings'
import NotificationsPage from './app/user/notifications'

// Admin Authentication
import AdminLoginPage from './app/admin/login'
import AdminSignupPage from './app/admin/signup'

// Admin Dashboard
import AdminDashboardPage from './app/admin/dashboard'
// Admin Slot Management Page and Live Queue page
import ManageSlotsPage from './app/admin/manage-slots' // 👈 Insert here
import LiveQueuePage from './app/admin/live-queue' 
import UsersPage from './app/admin/users'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} /> {/* ✅ Added about page */}
        <Route path="/contact" element={<ContactPage />} /> {/* ✅ Added about page */}


        {/* User Auth Routes */}
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/user/signup" element={<UserSignupPage />} />

        {/* User Features */}
        <Route path="/user/dashboard" element={<UserDashboardPage />} />
        <Route path="/user/book-slot" element={<UserBookSlotPage />} />
        <Route path="/user/my-bookings" element={<UserMyBookingsPage />} />
        <Route path="/user/notifications" element={<NotificationsPage />} />  {/* ✅ New Route */}

        {/* Admin Auth & Dashboard */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/manage-slots" element={<ManageSlotsPage />} /> 
        <Route path="/admin/live-queue" element={<LiveQueuePage />} /> 
        <Route path="/admin/users" element={<UsersPage />} />

        {/* Shortcut Redirects */}
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/book-slot" element={<Navigate to="/user/book-slot" replace />} />
        <Route path="/my-bookings" element={<Navigate to="/user/my-bookings" replace />} />
        <Route path="/login" element={<Navigate to="/user/login" replace />} />
        <Route path="/signup" element={<Navigate to="/user/signup" replace />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
