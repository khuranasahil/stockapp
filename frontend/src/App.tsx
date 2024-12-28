import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Loader2 } from 'lucide-react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { ScrollArea } from "./components/ui/scroll-area"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

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
  const { theme, setTheme } = useTheme()
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
      console.log('Making request to:', url);
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Basic ${btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`)}`
      };
      
      console.log('Request headers:', headers);
      const response = await fetch(url, {
        method: 'GET',
        headers,
        mode: 'cors'
      });
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
      <Card className="w-full max-w-6xl dark:bg-gray-800 dark:text-gray-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl dark:text-gray-100">Stock Market Data</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Enter stock tickers separated by commas (e.g., AAPL, MSFT, GOOGL)
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter stock tickers..."
              value={tickers}
              onChange={(e) => setTickers(e.target.value)}
              className="flex-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <Button 
              onClick={handleSubmit}
              className="whitespace-nowrap dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="dark:text-gray-300">Loading...</span>
                </span>
              ) : (
                'Get Stock Data'
              )}
            </Button>
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
          )}

          {stockData && (
            <ScrollArea className="h-[300px] rounded-md border dark:border-gray-700">
              <div className="p-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-3 text-left dark:text-gray-100 font-medium">Symbol</th>
                      <th className="p-3 text-left dark:text-gray-100 font-medium">Date</th>
                      <th className="p-3 text-left dark:text-gray-100 font-medium">Open</th>
                      <th className="p-3 text-left dark:text-gray-100 font-medium">High</th>
                      <th className="p-3 text-left dark:text-gray-100 font-medium">Low</th>
                      <th className="p-3 text-left dark:text-gray-100 font-medium">Close</th>
                      <th className="p-3 text-left dark:text-gray-100 font-medium">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.data.map((item, index) => (
                      <tr key={index} className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="p-3 dark:text-gray-200">{item.symbol}</td>
                        <td className="p-3 dark:text-gray-200">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="p-3 dark:text-gray-200">${item.open.toFixed(2)}</td>
                        <td className="p-3 dark:text-gray-200">${item.high.toFixed(2)}</td>
                        <td className="p-3 dark:text-gray-200">${item.low.toFixed(2)}</td>
                        <td className="p-3 dark:text-gray-200">${item.close.toFixed(2)}</td>
                        <td className="p-3 dark:text-gray-200">{item.volume.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          )}

          {stockData && stockData.data && stockData.data.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Stock Price History</h3>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={(() => {
                      // Group data by date, preserving symbol information
                      const groupedData: Record<string, any> = {};
                      stockData.data.forEach(item => {
                        const dateKey = new Date(item.date).toLocaleDateString();
                        if (!groupedData[dateKey]) {
                          groupedData[dateKey] = { date: dateKey };
                        }
                        groupedData[dateKey][item.symbol] = item.close;
                      });
                      return Object.values(groupedData);
                    })()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="date" 
                      stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
                    />
                    <YAxis 
                      stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: '1px solid #374151',
                        borderRadius: '0.375rem'
                      }}
                      labelStyle={{
                        color: theme === 'dark' ? '#E5E7EB' : '#111827'
                      }}
                    />
                    <Legend />
                    {(() => {
                      const uniqueSymbols = [...new Set(stockData.data.map(d => d.symbol))];
                      const colors = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899'];
                      return uniqueSymbols.map((symbol, idx) => (
                        <Line
                          key={symbol}
                          type="monotone"
                          dataKey={symbol}
                          stroke={colors[idx % colors.length]}
                          strokeWidth={2}
                          dot={false}
                          name={symbol}
                        />
                      ));
                    })()}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
