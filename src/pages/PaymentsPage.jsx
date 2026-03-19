import { useState } from 'react'
import './Pages.css'

const paymentMethods = [
  {
    id: 1,
    type: 'Bank Account',
    name: 'Chase Bank',
    account: '****1234',
    status: 'Verified',
    icon: '🏦'
  },
  {
    id: 2,
    type: 'Credit Card',
    name: 'Visa',
    account: '****8821',
    status: 'Active',
    icon: '💳'
  },
  {
    id: 3,
    type: 'Debit Card',
    name: 'Mastermind',
    account: '****5678',
    status: 'Active',
    icon: '💳'
  }
]

const paymentHistory = [
  {
    id: 1,
    recipient: 'Netflix Subscription',
    amount: '-$15.99',
    type: 'out',
    date: 'Mar 18, 2026',
    time: '10:30 AM',
    method: 'Visa ****8821'
  },
  {
    id: 2,
    recipient: 'Salary Deposit',
    amount: '+$5,250.00',
    type: 'in',
    date: 'Mar 15, 2026',
    time: '8:00 AM',
    method: 'ACH Transfer'
  },
  {
    id: 3,
    recipient: 'Starbucks',
    amount: '-$7.45',
    type: 'out',
    date: 'Mar 14, 2026',
    time: '7:15 AM',
    method: 'Visa ****8821'
  },
  {
    id: 4,
    recipient: 'Freelance Project',
    amount: '+$1,200.00',
    type: 'in',
    date: 'Mar 12, 2026',
    time: '2:30 PM',
    method: 'NexPay Transfer'
  },
  {
    id: 5,
    recipient: 'Rent Payment',
    amount: '-$1,500.00',
    type: 'out',
    date: 'Mar 1, 2026',
    time: '9:00 AM',
    method: 'Bank Transfer'
  },
  {
    id: 6,
    recipient: 'Gym Membership',
    amount: '-$49.99',
    type: 'out',
    date: 'Feb 28, 2026',
    time: '3:00 PM',
    method: 'Visa ****8821'
  }
]

function PaymentsPage({ onOpenModal }) {
  const [selectedMethod, setSelectedMethod] = useState(null)

  return (
    <div className="main">
      <div className="left-col">
        {/* PAYMENT METHODS */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Payment Methods</h2>
            <button className="btn-primary" onClick={() => onOpenModal('send')}>
              Add Method
            </button>
          </div>
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(method)}
              >
                <div className="method-icon">{method.icon}</div>
                <div className="method-info">
                  <div className="method-type">{method.type}</div>
                  <div className="method-name">{method.name}</div>
                  <div className="method-account">{method.account}</div>
                </div>
                <div className="method-status">
                  <span className={`status-badge ${method.status.toLowerCase()}`}>
                    {method.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT HISTORY */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Payment History</h2>
            <span className="view-all">View All →</span>
          </div>
          <div className="payment-list">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="payment-item">
                <div className="payment-left">
                  <div className={`payment-icon ${payment.type}`}>
                    {payment.type === 'in' ? '📥' : '📤'}
                  </div>
                  <div className="payment-details">
                    <div className="payment-recipient">{payment.recipient}</div>
                    <div className="payment-meta">
                      {payment.date} • {payment.time}
                    </div>
                    <div className="payment-method-used">{payment.method}</div>
                  </div>
                </div>
                <div className={`payment-amount ${payment.type}`}>
                  {payment.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="right-col">
        {selectedMethod && (
          <div className="section-card">
            <div className="section-title">Method Details</div>
            <div className="method-details-content">
              <div className="detail-row">
                <span className="detail-label">Type</span>
                <span className="detail-value">{selectedMethod.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span className="detail-value">{selectedMethod.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account</span>
                <span className="detail-value">{selectedMethod.account}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`status-badge ${selectedMethod.status.toLowerCase()}`}>
                  {selectedMethod.status}
                </span>
              </div>
              <button className="btn-secondary" style={{ marginTop: '20px' }}>
                Edit Method
              </button>
              <button className="btn-danger" style={{ marginTop: '8px' }}>
                Remove Method
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT STATS */}
        <div className="section-card">
          <div className="section-title">This Month</div>
          <div className="stat-summary">
            <div className="stat-item">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value" style={{ color: 'var(--red)' }}>
                −$1,573.43
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Received</div>
              <div className="stat-value" style={{ color: 'var(--green)' }}>
                +$6,450.00
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Transactions</div>
              <div className="stat-value">12</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentsPage
