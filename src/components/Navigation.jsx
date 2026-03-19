import { Link, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import './Navigation.css'

function Navigation({ toggleTheme, theme }) {
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    setProfileMenuOpen(false)
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">NexPay</Link>
      <div className="nav-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>Dashboard</Link>
        <Link to="/payments" className={isActive('/payments') ? 'active' : ''}>Payments</Link>
        <Link to="/cards" className={isActive('/cards') ? 'active' : ''}>Cards</Link>
        <Link to="/investments" className={isActive('/investments') ? 'active' : ''}>Investments</Link>
      </div>
      <div className="nav-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
        <Link to="/notifications" className="notif-btn" title="Notifications">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <div className="notif-dot"></div>
        </Link>
        
        {/* User Profile Dropdown */}
        <div className="profile-dropdown">
          <button
            className="avatar-btn"
            onClick={toggleProfileMenu}
            title={user?.name || 'Profile'}
          >
            <div className="avatar">{user?.initials || 'U'}</div>
          </button>
          
          {profileMenuOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-user-info">
                  <div className="dropdown-avatar">{user?.initials || 'U'}</div>
                  <div className="dropdown-user-details">
                    <div className="dropdown-name">{user?.name || 'User'}</div>
                    <div className="dropdown-email">{user?.email || ''}</div>
                  </div>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setProfileMenuOpen(false)}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                My Profile
              </Link>
              
              <Link
                to="/payments"
                className="dropdown-item"
                onClick={() => setProfileMenuOpen(false)}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <path d="M1 10h22"></path>
                </svg>
                Payments
              </Link>
              
              <div className="dropdown-divider"></div>
              
              <button
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
