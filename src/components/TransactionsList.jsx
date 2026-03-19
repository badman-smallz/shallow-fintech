const transactions = [
  {
    id: 1,
    name: 'John Anderson',
    description: 'Business Payment · ACH Transfer',
    amount: '+$12,500.00',
    type: 'in',
    icon: '💼',
    date: 'Today, 9:14 AM'
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    description: 'Personal Transfer · NexPay',
    amount: '−$3,200.00',
    type: 'out',
    icon: '🛍️',
    date: 'Yesterday, 3:45 PM'
  },
  {
    id: 3,
    name: 'Business Payment',
    description: 'Apex Solutions LLC · Wire',
    amount: '+$7,000.00',
    type: 'in',
    icon: '🏢',
    date: 'Mar 17, 11:22 AM'
  },
  {
    id: 4,
    name: 'Nobu Restaurant',
    description: 'Dining · Visa Debit ····4821',
    amount: '−$284.50',
    type: 'out',
    icon: '🍽️',
    date: 'Mar 16, 8:30 PM'
  },
  {
    id: 5,
    name: 'Dividend Payout',
    description: 'Portfolio Returns · Q1 2026',
    amount: '+$4,820.00',
    type: 'in',
    icon: '📈',
    date: 'Mar 15, 12:00 PM'
  },
  {
    id: 6,
    name: 'Emirates Airlines',
    description: 'Travel · Visa Debit ····4821',
    amount: '−$1,890.00',
    type: 'out',
    icon: '✈️',
    date: 'Mar 14, 2:15 PM'
  }
]

function TransactionsList() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 shadow-sm hover:border-blue-200 transition-all" id="transactions">
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg font-semibold text-slate-900">Recent Transactions</div>
        <div className="text-sm text-blue-500 cursor-pointer hover:text-blue-600 font-medium">View All →</div>
      </div>
      <div className="flex flex-col gap-0">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className={`flex items-center gap-3.5 py-4 border-b border-slate-200 hover:bg-slate-100 px-3 -mx-3 rounded transition-all ${
              tx.id === transactions.length ? 'border-b-0' : ''
            }`}
          >
            <div
              className={`text-xl w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 ${
                tx.type === 'in'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {tx.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900">{tx.name}</div>
              <div className="text-xs text-slate-500 mt-1">{tx.description}</div>
            </div>
            <div className="text-right">
              <div
                className={`font-semibold ${
                  tx.type === 'in'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {tx.amount}
              </div>
              <div className="text-xs text-slate-500 mt-1">{tx.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionsList
