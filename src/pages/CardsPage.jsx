import { useState } from 'react'
import './Pages.css'

const userCards = [
  {
    id: 1,
    type: 'Premium',
    brand: 'Visa',
    number: '•••• •••• •••• 4821',
    holder: 'John Doe',
    expiry: '12/26',
    status: 'Active',
    balance: '$12,450.00',
    icon: '💳'
  },
  {
    id: 2,
    type: 'Business',
    brand: 'Mastercard',
    number: '•••• •••• •••• 1205',
    holder: 'John Doe',
    expiry: '08/27',
    status: 'Active',
    balance: '$8,920.00',
    icon: '💼'
  },
  {
    id: 3,
    type: 'Travel',
    brand: 'Amex',
    number: '•••• •••• •••• 5634',
    holder: 'John Doe',
    expiry: '04/26',
    status: 'Active',
    balance: '$3,200.00',
    icon: '✈️'
  }
]

const cardLimits = [
  {
    type: 'Daily Limit',
    used: '$2,500',
    total: '$5,000',
    percentage: 50
  },
  {
    type: 'Monthly Limit',
    used: '$24,500',
    total: '$50,000',
    percentage: 49
  },
  {
    type: 'Contactless Limit',
    used: '$1,200',
    total: '$3,000',
    percentage: 40
  }
]

function CardsPage() {
  const [selectedCard, setSelectedCard] = useState(userCards[0])
  const [showAddCard, setShowAddCard] = useState(false)

  return (
    <div className="main">
      <div className="left-col">
        {/* CARDS LIST */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Your Cards</h2>
            <button className="btn-primary" onClick={() => setShowAddCard(!showAddCard)}>
              {showAddCard ? 'Cancel' : 'Add Card'}
            </button>
          </div>

          {showAddCard && (
            <div className="add-card-form">
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input className="form-input" type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Expiry Date</label>
                  <input className="form-input" type="text" placeholder="MM/YY" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">CVV</label>
                  <input className="form-input" type="text" placeholder="123" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input className="form-input" type="text" placeholder="John Doe" />
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                Add Card
              </button>
            </div>
          )}

          <div className="cards-grid">
            {userCards.map((card) => (
              <div
                key={card.id}
                className={`card-item ${selectedCard.id === card.id ? 'selected' : ''}`}
                onClick={() => setSelectedCard(card)}
              >
                <div className="card-item-header">
                  <span className="card-type-badge">{card.type}</span>
                  <span className="card-brand">{card.brand}</span>
                </div>
                <div className="card-item-number">{card.number}</div>
                <div className="card-item-footer">
                  <span className="card-holder">{card.holder}</span>
                  <span className="card-expiry">{card.expiry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD LIMITS */}
        <div className="section-card">
          <h2 className="section-title">Transaction Limits</h2>
          <div className="limits-list">
            {cardLimits.map((limit, idx) => (
              <div key={idx} className="limit-item">
                <div className="limit-header">
                  <span className="limit-type">{limit.type}</span>
                  <span className="limit-values">{limit.used} / {limit.total}</span>
                </div>
                <div className="limit-bar">
                  <div
                    className="limit-fill"
                    style={{
                      width: `${limit.percentage}%`,
                      background: limit.percentage > 80 ? 'var(--red)' : limit.percentage > 50 ? 'var(--gold)' : 'var(--green)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="right-col">
        {selectedCard && (
          <>
            {/* CARD DISPLAY */}
            <div className="card-display">
              <div className="card-display-header">
                <span className="card-display-type">{selectedCard.type}</span>
              </div>
              <div className="card-display-chip"></div>
              <div className="card-display-number">{selectedCard.number}</div>
              <div className="card-display-footer">
                <div>
                  <div className="card-display-label">Card Holder</div>
                  <div className="card-display-name">{selectedCard.holder}</div>
                </div>
                <div className="card-display-expiry">{selectedCard.expiry}</div>
              </div>
            </div>

            {/* CARD ACTIONS */}
            <div className="section-card">
              <div className="section-title">Quick Actions</div>
              <button className="card-action-btn">
                <span className="action-icon">🔒</span>
                <span>Lock Card</span>
              </button>
              <button className="card-action-btn">
                <span className="action-icon">🔄</span>
                <span>Replace Card</span>
              </button>
              <button className="card-action-btn">
                <span className="action-icon">⚙️</span>
                <span>Card Settings</span>
              </button>
              <button className="card-action-btn danger">
                <span className="action-icon">🗑️</span>
                <span>Delete Card</span>
              </button>
            </div>

            {/* CARD BALANCE */}
            <div className="section-card">
              <div className="section-title">Balance</div>
              <div className="balance-display">
                <div className="balance-label">Available</div>
                <div className="balance-amount">{selectedCard.balance}</div>
              </div>
              <div className="status-badge active" style={{ marginTop: '16px' }}>
                {selectedCard.status}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CardsPage
