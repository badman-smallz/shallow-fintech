import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  signup: () => {},
  logout: () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('nexpay_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to load user', error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email, password) => {
    // Simulate login - in a real app, this would call an API
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const userData = {
      id: '1',
      email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      firstname: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      lastname: 'Account',
      initials: email.charAt(0).toUpperCase() + email.split('@')[0].charAt(0).toUpperCase(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      joinDate: 'Jan 15, 2026',
      verified: true,
      balance: '$470,000.00',
      monthlySavings: '$12,660',
      preferredCurrency: 'USD',
      twoFactorEnabled: true,
      notifications: true,
      emailNotifications: true,
      smsNotifications: false
    }

    setUser(userData)
    localStorage.setItem('nexpay_user', JSON.stringify(userData))
    return userData
  }

  const signup = (email, password, confirmPassword, fullName) => {
    // Simulate signup validation
    if (!email || !password || !confirmPassword || !fullName) {
      throw new Error('All fields are required')
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    const [firstname, ...lastnameParts] = fullName.split(' ')
    const lastname = lastnameParts.join(' ') || 'Account'

    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: fullName,
      firstname: firstname || 'User',
      lastname: lastname || '',
      initials: (firstname?.charAt(0) || 'U') + (lastname?.charAt(0) || 'U'),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      phone: '+1 (555) 000-0000',
      location: 'Not specified',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      verified: false,
      balance: '$0.00',
      monthlySavings: '$0.00',
      preferredCurrency: 'USD',
      twoFactorEnabled: false,
      notifications: true,
      emailNotifications: true,
      smsNotifications: false
    }

    setUser(userData)
    localStorage.setItem('nexpay_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nexpay_user')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('nexpay_user', JSON.stringify(updatedUser))
    return updatedUser
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
