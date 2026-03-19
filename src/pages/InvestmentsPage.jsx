import { useState } from 'react'
import './Pages.css'

const portfolioItems = [
  {
    id: 1,
    name: 'Apple Inc.',
    ticker: 'AAPL',
    shares: 45,
    pricePerShare: '$178.50',
    totalValue: '$8,032.50',
    change: '+$452.25',
    changePercent: '+5.96%',
    icon: '📱'
  },
  {
    id: 2,
    name: 'Tesla Inc.',
    ticker: 'TSLA',
    shares: 20,
    pricePerShare: '$245.30',
    totalValue: '$4,906.00',
    change: '-$234.50',
    changePercent: '-4.57%',
    icon: '🚗'
  },
  {
    id: 3,
    name: 'S&P 500 ETF',
    ticker: 'SPY',
    shares: 60,
    pricePerShare: '$445.20',
    totalValue: '$26,712.00',
    change: '+$1,245.60',
    changePercent: '+4.88%',
    icon: '📊'
  },
  {
    id: 4,
    name: 'Vanguard Bond ETF',
    ticker: 'BND',
    shares: 120,
    pricePerShare: '$75.80',
    totalValue: '$9,096.00',
    change: '+$142.50',
    changePercent: '+1.59%',
    icon: '📈'
  },
  {
    id: 5,
    name: 'Bitcoin',
    ticker: 'BTC',
    shares: 0.25,
    pricePerShare: '$42,500.00',
    totalValue: '$10,625.00',
    change: '+$2,150.00',
    changePercent: '+25.30%',
    icon: '₿'
  },
  {
    id: 6,
    name: 'Ethereum',
    ticker: 'ETH',
    shares: 2,
    pricePerShare: '$2,180.50',
    totalValue: '$4,361.00',
    change: '+$512.60',
    changePercent: '+13.28%',
    icon: '⟠'
  }
]

const portfolioSummary = {
  totalValue: '$63,732.50',
  totalInvestment: '$58,250.00',
  totalGain: '+$5,482.50',
  totalGainPercent: '+9.41%'
}

function InvestmentsPage() {
  const [selectedInvestment, setSelectedInvestment] = useState(portfolioItems[0])
  const [filter, setFilter] = useState('all')

  const filteredPortfolio = portfolioItems.filter(item => {
    if (filter === 'stocks') return ['AAPL', 'TSLA', 'SPY'].includes(item.ticker)
    if (filter === 'crypto') return ['BTC', 'ETH'].includes(item.ticker)
    return true
  })

  return (
    <div className="main">
      <div className="left-col">
        {/* PORTFOLIO SUMMARY */}
        <div className="section-card">
          <h2 className="section-title">Portfolio Overview</h2>
          <div className="portfolio-summary-grid">
            <div className="summary-item">
              <div className="summary-label">Total Value</div>
              <div className="summary-value" style={{ color: 'var(--accent)' }}>
                {portfolioSummary.totalValue}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Invested</div>
              <div className="summary-value">{portfolioSummary.totalInvestment}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Gain/Loss</div>
              <div className="summary-value" style={{ color: 'var(--green)' }}>
                {portfolioSummary.totalGain}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Return %</div>
              <div className="summary-value" style={{ color: 'var(--gold)' }}>
                {portfolioSummary.totalGainPercent}
              </div>
            </div>
          </div>
        </div>

        {/* PORTFOLIO FILTER */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Assets
          </button>
          <button
            className={`filter-btn ${filter === 'stocks' ? 'active' : ''}`}
            onClick={() => setFilter('stocks')}
          >
            Stocks
          </button>
          <button
            className={`filter-btn ${filter === 'crypto' ? 'active' : ''}`}
            onClick={() => setFilter('crypto')}
          >
            Crypto
          </button>
        </div>

        {/* HOLDINGS */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Your Holdings</h2>
            <button className="btn-primary">Buy Asset</button>
          </div>
          <div className="holdings-list">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                className={`holding-item ${selectedInvestment.id === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedInvestment(item)}
              >
                <div className="holding-left">
                  <div className="holding-icon">{item.icon}</div>
                  <div className="holding-info">
                    <div className="holding-name">
                      {item.name}
                      <span className="holding-ticker">({item.ticker})</span>
                    </div>
                    <div className="holding-shares">{item.shares} shares</div>
                  </div>
                </div>
                <div className="holding-right">
                  <div className="holding-value">{item.totalValue}</div>
                  <div className={`holding-change ${item.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {item.change} {item.changePercent}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="right-col">
        {selectedInvestment && (
          <>
            {/* ASSET DETAILS */}
            <div className="section-card">
              <div className="asset-header">
                <div className="asset-icon">{selectedInvestment.icon}</div>
                <div className="asset-name-section">
                  <div className="asset-name">{selectedInvestment.name}</div>
                  <div className="asset-ticker">{selectedInvestment.ticker}</div>
                </div>
              </div>

              <div className="asset-details">
                <div className="detail-row">
                  <span className="detail-label">Price per Share</span>
                  <span className="detail-value">{selectedInvestment.pricePerShare}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Shares Owned</span>
                  <span className="detail-value">{selectedInvestment.shares}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Value</span>
                  <span className="detail-value" style={{ color: 'var(--accent)' }}>
                    {selectedInvestment.totalValue}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Gain/Loss</span>
                  <span
                    className="detail-value"
                    style={{
                      color: selectedInvestment.change.startsWith('+') ? 'var(--green)' : 'var(--red)'
                    }}
                  >
                    {selectedInvestment.change} ({selectedInvestment.changePercent})
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="section-card">
              <button className="btn-primary" style={{ width: '100%', marginBottom: '8px' }}>
                Buy More
              </button>
              <button className="btn-secondary" style={{ width: '100%' }}>
                Sell
              </button>
            </div>

            {/* ALLOCATION */}
            <div className="section-card">
              <h3 className="section-title">Portfolio Allocation</h3>
              <div className="allocation-items">
                <div className="allocation-item">
                  <div className="allocation-header">
                    <span>Stocks</span>
                    <span>60%</span>
                  </div>
                  <div className="allocation-bar">
                    <div className="allocation-fill" style={{ width: '60%', background: 'var(--accent)' }}></div>
                  </div>
                </div>
                <div className="allocation-item">
                  <div className="allocation-header">
                    <span>Bonds</span>
                    <span>25%</span>
                  </div>
                  <div className="allocation-bar">
                    <div className="allocation-fill" style={{ width: '25%', background: 'var(--green)' }}></div>
                  </div>
                </div>
                <div className="allocation-item">
                  <div className="allocation-header">
                    <span>Crypto</span>
                    <span>15%</span>
                  </div>
                  <div className="allocation-bar">
                    <div className="allocation-fill" style={{ width: '15%', background: 'var(--gold)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default InvestmentsPage
