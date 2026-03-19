function VirtualCard() {
  return (
    <div className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-blue-500/20 rounded-2xl p-6 overflow-hidden h-48">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      {/* Badge */}
      <div className="absolute top-4 right-4 text-xs font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full z-10">
        Premier
      </div>
      
      {/* Card chip */}
      <div className="absolute top-6 left-6 w-12 h-10 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-2xl z-10"></div>
      
      {/* Card number */}
      <div className="relative flex items-center justify-center h-24 text-slate-100 text-xl font-semibold tracking-widest font-syne">
        •••• &nbsp;•••• &nbsp;•••• &nbsp;4821
      </div>
      
      {/* Card bottom with holder name and network */}
      <div className="relative flex items-center justify-between px-2">
        <div className="flex flex-col text-xs text-slate-300 font-medium">
          <span className="text-slate-500 text-xs uppercase tracking-wide">Card Holder</span>
          <span>John Doe</span>
        </div>
        <div className="text-xs font-semibold text-slate-300">⬡⬡</div>
      </div>
    </div>
  )
}

export default VirtualCard
