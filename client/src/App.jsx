import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

import Navbar from './components/Layout/Navbar';
import CartSidebar from './components/Cart/CartSidebar';
import Hero from './pages/Hero';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Facilities from './pages/Facilities';
import Login from './pages/Auth/Login';
import CustomerLogin from './pages/Auth/CustomerLogin';
import StaffLogin from './pages/Auth/StaffLogin';
import AdminLogin from './pages/Auth/AdminLogin';
import Register from './pages/Auth/Register';
import CustomerDashboard from './pages/Dashboard/CustomerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import StaffDashboard from './pages/Dashboard/StaffDashboard';
import AdminComplaints from './pages/Admin/AdminComplaints';
import BookingPage from './pages/BookingPage';
import FoodMenu from './pages/FoodMenu';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Complaints from './pages/Complaints';
import Chat from './pages/Chat';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import PublicRoute from './components/Auth/PublicRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <CartProvider>
              <Router
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true
                }}
              >
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                  <Routes>
                    {/* Public Routes (only for non-authenticated users) */}
                    <Route
                      path="/"
                      element={
                        <PublicRoute>
                          <Hero />
                        </PublicRoute>
                      }
                    />
                    
                    {/* Authentication Routes */}
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <CustomerLogin />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/customer/login"
                      element={
                        <PublicRoute>
                          <CustomerLogin />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/staff/login"
                      element={
                        <PublicRoute>
                          <StaffLogin />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/admin/login"
                      element={
                        <PublicRoute>
                          <AdminLogin />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      }
                    />

                    {/* Protected Routes with Navbar */}
                    <Route
                      path="/home"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <>
                            <Navbar />
                            <Home />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/rooms"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <>
                            <Navbar />
                            <Rooms />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/rooms/:id"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <>
                            <Navbar />
                            <RoomDetails />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/facilities"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <>
                            <Navbar />
                            <Facilities />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/food-menu"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <>
                            <Navbar />
                            <FoodMenu />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute allowedRoles={['customer']}>
                          <>
                            <Navbar />
                            <Checkout />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <>
                            <Navbar />
                            <Profile />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <>
                            <Navbar />
                            <Notifications />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/complaints"
                      element={
                        <ProtectedRoute allowedRoles={['customer']}>
                          <>
                            <Navbar />
                            <Complaints />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />

                    {/* Role-specific Dashboard Routes */}
                    <Route
                      path="/customer/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['customer']}>
                          <>
                            <Navbar />
                            <CustomerDashboard />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <>
                            <Navbar />
                            <AdminDashboard />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/staff/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['staff']} requireApproval={true}>
                          <>
                            <Navbar />
                            <StaffDashboard />
                          </>
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin-specific Routes */}
                    <Route
                      path="/admin/complaints"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <>
                            <Navbar />
                            <AdminComplaints />
                          </>
                        </ProtectedRoute>
                      }
                    />

                    {/* Other Protected Routes */}
                    <Route
                      path="/book/:roomId"
                      element={
                        <ProtectedRoute allowedRoles={['customer']}>
                          <>
                            <Navbar />
                            <BookingPage />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                          <>
                            <Navbar />
                            <Chat />
                            <CartSidebar />
                          </>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                  
                  {/* Global Toast Notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--gray-800)',
                        color: 'var(--white)',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500',
                      },
                      success: {
                        duration: 3000,
                        iconTheme: {
                          primary: 'var(--success)',
                          secondary: 'var(--white)',
                        },
                      },
                      error: {
                        duration: 4000,
                        iconTheme: {
                          primary: 'var(--error)',
                          secondary: 'var(--white)',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </CartProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;