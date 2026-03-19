function BalanceCard() {
  return (
    <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-9 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-green-500"></div>
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-radial from-blue-500/15 to-transparent pointer-events-none"></div>
      
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">Total Portfolio Balance</div>
      <h2 className="text-5xl font-bold font-syne text-slate-900 mb-2 leading-tight">$470,000.00</h2>
      <div className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
        +$12,450 (2.72%) this month
      </div>
      
      <div className="flex gap-8 mt-7 pt-7 border-t border-slate-200">
        <div className="flex flex-col gap-1">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Available</div>
          <div className="text-lg font-bold font-syne text-slate-900">$124,320</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Invested</div>
          <div className="text-lg font-bold font-syne text-slate-900">$298,500</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Savings</div>
          <div className="text-lg font-bold font-syne text-slate-900">$47,180</div>
        </div>
      </div>
    </div>
  )
}

export default BalanceCard
