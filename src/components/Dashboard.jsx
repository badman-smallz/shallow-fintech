import BalanceCard from './BalanceCard'
import ActionButtons from './ActionButtons'
import TransactionsList from './TransactionsList'
import VirtualCard from './VirtualCard'
import StatsSummary from './StatsSummary'
import QuickSend from './QuickSend'

function Dashboard({ onOpenModal }) {
  const handleScrollToTransactions = () => {
    const element = document.getElementById('transactions')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div className="flex flex-col gap-6">
        <BalanceCard />
        <ActionButtons onOpenModal={onOpenModal} onScrollToTransactions={handleScrollToTransactions} />
        <TransactionsList />
      </div>

      <div className="flex flex-col gap-6">
        <VirtualCard />
        <StatsSummary />
        <QuickSend onOpenModal={onOpenModal} />
      </div>
    </div>
  )
}

export default Dashboard
