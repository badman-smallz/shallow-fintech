function ActionButtons({ onOpenModal, onScrollToTransactions }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <button
        className="bg-slate-50 border border-slate-200 rounded-lg p-5 cursor-pointer text-center flex flex-col items-center gap-2.5 transition-all hover:bg-slate-100 hover:border-blue-300 hover:shadow-md"
        onClick={() => onOpenModal('send')}
      >
        <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-900">Send Money</div>
          <div className="text-xs text-slate-500">Instant transfer</div>
        </div>
      </button>
      <button
        className="bg-slate-50 border border-slate-200 rounded-lg p-5 cursor-pointer text-center flex flex-col items-center gap-2.5 transition-all hover:bg-slate-100 hover:border-blue-300 hover:shadow-md"
        onClick={() => onOpenModal('request')}
      >
        <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-500 flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-900">Request Payment</div>
          <div className="text-xs text-slate-500">Send a request</div>
        </div>
      </button>
      <button
        className="bg-slate-50 border border-slate-200 rounded-lg p-5 cursor-pointer text-center flex flex-col items-center gap-2.5 transition-all hover:bg-slate-100 hover:border-blue-300 hover:shadow-md"
        onClick={onScrollToTransactions}
      >
        <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-500 flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-900">Transaction History</div>
          <div className="text-xs text-slate-500">View all activity</div>
        </div>
      </button>
    </div>
  )
}

export default ActionButtons
