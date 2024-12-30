import { useState, useMemo, useCallback } from 'react'
import ErrorBoundary from './components/ui/ErrorBoundary'

interface ChartDataPoint {
  date: string;
  [key: string]: string | number | null;
}
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
  const userAgent = typeof window !== 'undefined' ? navigator.userAgent : ''
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)

  const { theme, setTheme } = useTheme()
  const [tickers, setTickers] = useState('')
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // State change monitoring removed for simplification

  const handleSubmit = async () => {
    if (!tickers.trim()) {
      setError('Please enter at least one ticker symbol')
      return
    }

    // Request management simplified

    // Only update loading state, keep previous data visible during fetch
    setLoading(true)
    setError(null)

    try {
      // Use environment variable for API base URL
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
      console.log('Making request to:', `${apiBaseUrl}/api/stocks/eod?symbols=${tickers}`, 'with env:', apiBaseUrl);
      const url = `${apiBaseUrl}/api/stocks/eod`;
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`)}`
      };
      const response = await fetch(`${url}?symbols=${encodeURIComponent(tickers)}`, {
        method: 'GET',
        headers,

      });
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch stock data: ${errorText}`)
      }
      
      const data = await response.json()
      
      // Batch state updates to prevent unnecessary re-renders
      const stateUpdates = () => {
        setStockData(data)
        setError(null)
      }
      stateUpdates()
    } catch (err) {
      console.error('Fetch error:', err)
      // Keep previous data visible on error
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTickerChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase()
    setTickers(value)
  }, [])

  // Transform data for chart with optimized lookups and performance monitoring
  const transformDataForChart = useCallback((data: StockData['data']) => {
    // Create Map for O(1) lookups
    const dataMap = new Map(
      data.map(item => {
        // Date is already in ISO format, just parse it once
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString();
        return [`${item.symbol}-${dateStr}`, item.close];
      })
    );
    // Get and sort unique dates
    const uniqueDates = [...new Set(
      data.map(item => new Date(item.date)) // Date is already in ISO format
    )].sort((a, b) => a.getTime() - b.getTime())
      .map(date => date.toLocaleDateString());
    // Get unique symbols
    const symbols = [...new Set(data.map(item => item.symbol))];
    const result = uniqueDates.map(date => {
      const dataPoint: ChartDataPoint = { date };
      symbols.forEach(symbol => {
        dataPoint[`${symbol} Close`] = dataMap.get(`${symbol}-${date}`) ?? null;
      });
      return dataPoint;
    });
    return result;
  }, []);

  // Memoize chart data with performance monitoring
  const chartData = useMemo(() => {
    if (!stockData?.data) return [];
    return transformDataForChart(stockData.data);
  }, [stockData?.data, transformDataForChart]);

  // Memoize unique symbols and colors for the chart
  const { uniqueSymbols, colors } = useMemo(() => ({
    uniqueSymbols: stockData?.data ? [...new Set(stockData.data.map(d => d.symbol))] : [],
    colors: ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899']
  }), [stockData?.data]);

  return (
    <ErrorBoundary>
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
              onChange={handleTickerChange}
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
                <ResponsiveContainer width="100%" height="100%" debounce={isMobile ? 150 : 50}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
                        borderRadius: '0.375rem',
                        padding: '10px'
                      }}
                      labelStyle={{
                        color: theme === 'dark' ? '#E5E7EB' : '#111827',
                        marginBottom: '5px'
                      }}
                      formatter={(value, name) => [`$${Number(value).toFixed(2)}`, `${name}`]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '20px',
                        color: theme === 'dark' ? '#E5E7EB' : '#111827'
                      }}
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                    {uniqueSymbols.map((symbol, idx) => (
                        <Line
                          key={symbol}
                          type="monotone"
                          dataKey={`${symbol} Close`}
                          stroke={colors[idx % colors.length]}
                          strokeWidth={2}
                          dot={false}
                          name={`${symbol} Close Price`}
                          connectNulls={true}
                          isAnimationActive={false}
                          activeDot={{ r: 4 }}
                          legendType="line"
                        />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </ErrorBoundary>
  )
}

export default App
