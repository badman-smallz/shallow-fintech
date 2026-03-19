const contacts = [
  { id: 1, name: 'Sarah', initials: 'SM', gradient: 'linear-gradient(135deg,#f76b6b,#c0392b)' },
  { id: 2, name: 'John', initials: 'JA', gradient: 'linear-gradient(135deg,#4f8ef7,#1a6fd4)' },
  { id: 3, name: 'Apex', initials: 'AP', gradient: 'linear-gradient(135deg,#22d3a0,#0ea573)' },
  { id: 4, name: 'Marcus', initials: 'MR', gradient: 'linear-gradient(135deg,#f5c842,#d4a017)' }
]

function QuickSend({ onOpenModal }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 shadow-sm hover:border-blue-200 transition-all">
      <div className="text-lg font-semibold text-slate-900 mb-4">Quick Send</div>
      <div className="flex flex-col gap-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex flex-col items-center cursor-pointer gap-2 transition-all hover:opacity-80"
            onClick={() => onOpenModal('send', contact.name)}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-sm"
              style={{ background: contact.gradient }}
            >
              {contact.initials}
            </div>
            <div className="text-xs font-medium text-slate-600 text-center">{contact.name}</div>
          </div>
        ))}
        <div
          className="flex flex-col items-center cursor-pointer gap-2 transition-all hover:opacity-80"
          onClick={() => onOpenModal('send')}
        >
          <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-semibold">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <div className="text-xs font-medium text-slate-600 text-center">Add</div>
        </div>
      </div>
    </div>
  )
}

export default QuickSend
