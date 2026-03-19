import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import './Profile.css'

function ProfilePage() {
  const { user, updateProfile, logout } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  })
  const [settingsData, setSettingsData] = useState({
    twoFactorEnabled: user?.twoFactorEnabled || false,
    notifications: user?.notifications || true,
    emailNotifications: user?.emailNotifications || true,
    smsNotifications: user?.smsNotifications || false
  })

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    const fieldData = ['twoFactorEnabled', 'notifications', 'emailNotifications', 'smsNotifications']
    
    if (fieldData.includes(name)) {
      setSettingsData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = () => {
    const fullName = `${formData.firstname} ${formData.lastname}`.trim()
    updateProfile({
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      name: fullName,
      ...settingsData
    })
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-large">{user.initials}</div>
          <div className="profile-header-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-status">
              <span className={`status-badge ${user.verified ? 'verified' : 'pending'}`}>
                {user.verified ? '✓ Verified' : 'Pending Verification'}
              </span>
              <span className="member-since">Member since {user.joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-wrapper">
        <div className="profile-left">
          {/* ACCOUNT INFORMATION */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">Account Information</h2>
              <button
                className={`edit-btn ${isEditing ? 'cancel' : ''}`}
                onClick={() => {
                  if (isEditing) {
                    setFormData({
                      firstname: user?.firstname || '',
                      lastname: user?.lastname || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      location: user?.location || ''
                    })
                  }
                  setIsEditing(!isEditing)
                }}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstname"
                      className="form-input"
                      value={formData.firstname}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      className="form-input"
                      value={formData.lastname}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                </div>

                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="profile-info-display">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{user.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Location</span>
                  <span className="info-value">{user.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* SECURITY SETTINGS */}
          <div className="profile-card">
            <h2 className="card-title">Security Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Two-Factor Authentication</div>
                  <div className="setting-description">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="twoFactorEnabled"
                    checked={settingsData.twoFactorEnabled}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Change Password</div>
                  <div className="setting-description">
                    Update your password regularly for better security
                  </div>
                </div>
                <button className="setting-action-btn">Update</button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Active Sessions</div>
                  <div className="setting-description">
                    View and manage your active sessions
                  </div>
                </div>
                <button className="setting-action-btn">Manage</button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Login Activity</div>
                  <div className="setting-description">
                    Recent sign-in activity and suspicious logins
                  </div>
                </div>
                <button className="setting-action-btn">View</button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-right">
          {/* ACCOUNT STATS */}
          <div className="profile-card">
            <h2 className="card-title">Account Overview</h2>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon">💰</div>
                <div className="stat-label">Balance</div>
                <div className="stat-value">{user.balance}</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">💸</div>
                <div className="stat-label">Monthly Savings</div>
                <div className="stat-value">{user.monthlySavings}</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">🌍</div>
                <div className="stat-label">Preferred Currency</div>
                <div className="stat-value">{user.preferredCurrency}</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">📅</div>
                <div className="stat-label">Member Since</div>
                <div className="stat-value">{user.joinDate}</div>
              </div>
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div className="profile-card">
            <h2 className="card-title">Notifications</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">All Notifications</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settingsData.notifications}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Email Notifications</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settingsData.emailNotifications}
                    onChange={handleChange}
                    disabled={!settingsData.notifications}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">SMS Notifications</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settingsData.smsNotifications}
                    onChange={handleChange}
                    disabled={!settingsData.notifications}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="profile-card danger-zone">
            <h2 className="card-title">Danger Zone</h2>
            <div className="danger-actions">
              <button className="danger-btn">Download My Data</button>
              <button className="danger-btn">Deactivate Account</button>
              <button className="logout-btn" onClick={logout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
