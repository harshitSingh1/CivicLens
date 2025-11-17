// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import MapView from './pages/MapView';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Login from './pages/Login';
import About from './pages/About';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';
import IssueDetails from './pages/IssueDetails';
import CivicUpdates from './pages/CivicUpdates';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AuthorizedRoute from './components/AuthorizedRoute';
import Contact from './pages/Contact';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/updates" element={<CivicUpdates />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/report" element={<ReportIssue />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/issues/:id" element={<IssueDetails />} />
                </Route>

                {/* Authority-only routes */}
                <Route element={<AuthorizedRoute allowedRoles={['authority', 'admin']} />}>
                  <Route path="/authority" element={<AuthorityDashboard />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 5000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: 'white',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: 'white',
                },
              },
            }}
          />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;