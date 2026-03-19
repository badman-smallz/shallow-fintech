import { useState } from 'react'

const notificationsData = [
  {
    id: 1,
    type: 'transaction',
    title: 'Payment Received',
    message: 'Direct deposit of $12,500 from Acme Corp',
    detail: 'Your salary has been deposited to your checking account.',
    time: 'Today, 8:00 AM',
    icon: '💰',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'security',
    title: 'New Login Detected',
    message: 'Your account was accessed from a new device',
    detail: 'Device: Chrome on Windows | Location: San Francisco, CA | IP: 192.168.1.1',
    time: 'Today, 6:30 PM',
    icon: '🔔',
    read: false,
    priority: 'high'
  },
  {
    id: 3,
    type: 'statement',
    title: 'Monthly Statement Ready',
    message: 'Your March 2026 account statement is available',
    detail: 'Download or view your complete transaction history and account summary.',
    time: 'Mar 17, 2026',
    icon: '📄',
    read: true,
    priority: 'medium'
  },
  {
    id: 4,
    type: 'investment',
    title: 'Stock Alert: AAPL',
    message: 'Apple stock reached your target price of $178.50',
    detail: 'Your alert for AAPL has been triggered. Current price matches your target.',
    time: 'Mar 16, 2026',
    icon: '📈',
    read: true,
    priority: 'medium'
  },
  {
    id: 5,
    type: 'promotion',
    title: 'Exclusive Offer',
    message: 'Get 0% APR for 12 months on transfers',
    detail: 'Limited time offer for premium members. Transfer balance from other cards with no interest.',
    time: 'Mar 15, 2026',
    icon: '🎁',
    read: true,
    priority: 'low'
  },
  {
    id: 6,
    type: 'transaction',
    title: 'Large Transaction Alert',
    message: 'Transaction of $5,000 to Wire Transfer',
    detail: 'A large transfer of $5,000 was made to external account ending in 4821.',
    time: 'Mar 14, 2026',
    icon: '⚠️',
    read: true,
    priority: 'high'
  },
  {
    id: 7,
    type: 'service',
    title: 'Card Renewal',
    message: 'Your credit card will expire soon',
    detail: 'Your Visa card ending in 4821 will expire on 12/26. A replacement card is being sent.',
    time: 'Mar 13, 2026',
    icon: '💳',
    read: true,
    priority: 'medium'
  },
  {
    id: 8,
    type: 'promotion',
    title: 'Cashback Bonus',
    message: 'Earn extra 2% cashback this weekend',
    detail: 'Special weekend promotion: All purchases earn 2% cashback on featured merchants.',
    time: 'Mar 12, 2026',
    icon: '💸',
    read: true,
    priority: 'low'
  }
]

function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [filter, setFilter] = useState('all')

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read
    if (filter === 'high') return notif.priority === 'high'
    return true
  })

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
    setSelectedNotification(null)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div className="flex flex-col gap-6">
        {/* NOTIFICATIONS HEADER */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <h2 className="font-syne text-lg font-bold text-slate-900">Notifications ({unreadCount} new)</h2>
          <div className="flex gap-2">
            <button
              className={`inline-flex px-3 py-2 text-xs font-medium uppercase tracking-wide rounded-lg border transition-all ${
                filter === 'all'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`inline-flex px-3 py-2 text-xs font-medium uppercase tracking-wide rounded-lg border transition-all ${
                filter === 'unread'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'
              }`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`inline-flex px-3 py-2 text-xs font-medium uppercase tracking-wide rounded-lg border transition-all ${
                filter === 'high'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'
              }`}
              onClick={() => setFilter('high')}
            >
              Important
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="flex flex-col gap-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 px-5 text-slate-500">
              <div className="text-6xl mb-4">🔔</div>
              <div className="text-lg font-semibold text-slate-900 mb-2">No notifications</div>
              <div className="text-sm text-slate-500">
                {filter === 'unread' ? 'You\'re all caught up!' : 'Check back later for updates'}
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex gap-4 p-4 border-b border-slate-200 cursor-pointer transition-all ${
                  !notif.read ? 'bg-blue-50' : ''
                } ${
                  selectedNotification?.id === notif.id
                    ? 'bg-slate-100 border-l-4 border-l-blue-500 pl-3'
                    : 'hover:bg-slate-100'
                }`}
                onClick={() => {
                  setSelectedNotification(notif)
                  if (!notif.read) markAsRead(notif.id)
                }}
              >
                <div className="text-2xl flex-shrink-0">{notif.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    {notif.title}
                    {notif.priority === 'high' && (
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">!</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 mt-1 truncate">{notif.message}</div>
                  <div className="text-xs text-slate-500 mt-1 opacity-70">{notif.time}</div>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5 ml-3"></div>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* NOTIFICATION DETAILS */}
      <div className="flex flex-col gap-6">
        {selectedNotification ? (
          <>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 shadow-sm hover:border-blue-200 transition-all">
              <div className="flex gap-4 pb-5 border-b border-slate-200 mb-6">
                <div className="text-4xl flex-shrink-0">{selectedNotification.icon}</div>
                <div className="flex-1">
                  <h3 className="font-syne text-lg font-bold text-slate-900 m-0 mb-1">{selectedNotification.title}</h3>
                  <p className="text-xs text-slate-500 m-0">{selectedNotification.time}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-slate-900 mb-3">{selectedNotification.message}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{selectedNotification.detail}</p>

                <div className="flex flex-col gap-3 p-4 bg-slate-100 rounded-xl">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider min-w-fit">Type:</span>
                    <span className="text-slate-900 font-medium">{selectedNotification.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider min-w-fit">Priority:</span>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        selectedNotification.priority === 'high'
                          ? 'bg-red-100 text-red-600'
                          : selectedNotification.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {selectedNotification.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {!selectedNotification.read && (
                  <button
                    className="flex-1 px-5 py-2.5 bg-slate-200 border border-slate-300 rounded-lg text-slate-900 text-sm font-semibold cursor-pointer transition-all hover:bg-slate-300"
                    onClick={() => markAsRead(selectedNotification.id)}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  className="flex-1 px-5 py-2.5 bg-red-100 border border-red-300 rounded-lg text-red-600 text-sm font-semibold cursor-pointer transition-all hover:bg-red-200"
                  onClick={() => deleteNotification(selectedNotification.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* RELATED ACTIONS */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 shadow-sm hover:border-blue-200 transition-all">
              <h4 className="font-syne text-lg font-bold text-slate-900 mb-4">Actions</h4>
              {selectedNotification.type === 'transaction' && (
                <>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    View Transaction Details
                  </button>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    Print Receipt
                  </button>
                </>
              )}
              {selectedNotification.type === 'security' && (
                <>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    Review Security Settings
                  </button>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    View Active Sessions
                  </button>
                </>
              )}
              {selectedNotification.type === 'investment' && (
                <>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    View Investment
                  </button>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    Manage Alerts
                  </button>
                </>
              )}
              {selectedNotification.type === 'statement' && (
                <>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    Download PDF
                  </button>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    View Online
                  </button>
                </>
              )}
              {selectedNotification.type === 'promotion' && (
                <>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    View Offer Details
                  </button>
                  <button className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-blue-500 text-sm font-medium cursor-pointer transition-all mb-2 text-left hover:bg-blue-500 hover:text-white hover:border-blue-500">
                    Claim Now
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 shadow-sm hover:border-blue-200 transition-all">
            <div className="text-center py-20 px-5 text-slate-500">
              <div className="text-6xl mb-4">👈</div>
              <div className="text-lg font-semibold text-slate-900 mb-2">Select a notification</div>
              <div className="text-sm text-slate-500">
                Click on any notification to view details
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
