import { useState, useEffect } from 'react'
import './SendModal.css'

function SendModal({ isOpen, onClose, type, initialRecipient, onSubmit }) {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    note: ''
  })

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      recipient: initialRecipient
    }))
  }, [initialRecipient])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'amount') {
      // Format amount input
      let formatted = value.replace(/[^0-9.]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: formatted ? '$' + formatted : ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ recipient: '', amount: '', note: '' })
  }

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay open') {
      onClose()
    }
  }

  const title = type === 'request' ? 'Request Payment' : 'Send Money'
  const buttonText = type === 'request' ? 'Send Request' : 'Send Money'

  return (
    <div
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Recipient</label>
            <input
              className="form-input"
              type="text"
              name="recipient"
              placeholder="Name or @username"
              value={formData.recipient}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Amount (USD)</label>
            <input
              className="form-input amount"
              type="text"
              name="amount"
              placeholder="$0.00"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Note (optional)</label>
            <input
              className="form-input"
              type="text"
              name="note"
              placeholder="What's it for?"
              value={formData.note}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="modal-submit">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SendModal
