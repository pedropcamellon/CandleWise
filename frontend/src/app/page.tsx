import PortfolioDashboard from '@/components/PortfolioDashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">CandleWise</h1>
              <span className="ml-3 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Portfolio Management
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="text-sm font-medium text-gray-900">Demo User</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Live Data</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="#" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Portfolio Overview
            </a>
            <a href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Transaction History
            </a>
            <a href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Performance Analytics
            </a>
            <a href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Market Research
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Dashboard</h2>
          <p className="text-gray-600">
            Track your investments, monitor performance, and manage your stock portfolio with real-time market data
          </p>
        </div>

        <PortfolioDashboard />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="my-4 px-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              CandleWise - Portfolio Management. Built with ASP.NET Core & Next.js.
            </p>
            <p className="text-sm text-gray-500">
              Powered by Alpaca Markets API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
