const stats = [
  {
    id: 1,
    label: 'Total Income',
    value: '+$38,400',
    dotColor: 'var(--green)',
    valueColor: 'var(--green)'
  },
  {
    id: 2,
    label: 'Total Expenses',
    value: '−$11,240',
    dotColor: 'var(--red)',
    valueColor: 'var(--red)'
  },
  {
    id: 3,
    label: 'Investments',
    value: '$14,500',
    dotColor: 'var(--gold)',
    valueColor: 'var(--gold)'
  },
  {
    id: 4,
    label: 'Net Savings',
    value: '+$12,660',
    dotColor: 'var(--accent)',
    valueColor: 'var(--accent)'
  }
]

function StatsSummary() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 shadow-sm hover:border-blue-200 transition-all">
      <div className="text-lg font-semibold text-slate-900 mb-4">Monthly Summary</div>
      <div className="flex flex-col gap-0">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`flex items-center justify-between py-3 border-b border-slate-200 ${
              stat.id === stats.length ? 'border-b-0' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: stat.dotColor }}
              ></div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
            <div className="font-semibold" style={{ color: stat.valueColor }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsSummary
