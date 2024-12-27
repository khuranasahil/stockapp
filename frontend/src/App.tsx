import { useState } from 'react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"

interface StockData {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: Array<{
    symbol: string;
    exchange: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

function App() {
  const [tickers, setTickers] = useState('')
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Note: SSL certificate validation is handled at the browser level for development

  const handleSubmit = async () => {
    if (!tickers.trim()) {
      setError('Please enter at least one ticker symbol')
      return
    }

    setLoading(true)
    setError(null)
    setStockData(null)

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/stocks/eod?symbols=${tickers}`;
      console.log('Fetching from:', url);
      console.log('Environment:', import.meta.env);
      
      // TODO: SSL certificate validation is disabled for development purposes only.
      // This should be properly configured with valid certificates in production.
      console.log('Making request to:', url);
      // TODO: Remove this in production. Only for development with self-signed certificate
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch stock data: ${errorText}`)
      }
      
      const data = await response.json()
      setStockData(data)
      setError(null)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl">Stock Market Data</CardTitle>
          <CardDescription>
            Enter stock tickers separated by commas (e.g., AAPL, MSFT, GOOGL)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter stock tickers..."
              value={tickers}
              onChange={(e) => setTickers(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSubmit}
              className="whitespace-nowrap"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Stock Data'}
            </Button>
          </div>

          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          {stockData && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Symbol</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Open</th>
                    <th className="p-2 text-left">High</th>
                    <th className="p-2 text-left">Low</th>
                    <th className="p-2 text-left">Close</th>
                    <th className="p-2 text-left">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.data.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{item.symbol}</td>
                      <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="p-2">${item.open.toFixed(2)}</td>
                      <td className="p-2">${item.high.toFixed(2)}</td>
                      <td className="p-2">${item.low.toFixed(2)}</td>
                      <td className="p-2">${item.close.toFixed(2)}</td>
                      <td className="p-2">{item.volume.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
