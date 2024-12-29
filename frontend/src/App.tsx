import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Extended Performance interface for Chrome
interface MemoryMetrics {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface ExtendedPerformance extends Performance {
  memory?: MemoryMetrics;
}

interface DeviceDetails {
  userAgent: string;
  platform: string;
  vendor: string;
  viewport: {
    width: number;
    height: number;
  };
  pixelRatio: number;
  orientation: string;
  memory: MemoryMetrics | string;
}

interface DeviceInfo {
  environment: string;
  deviceType: string;
  deviceDetails: DeviceDetails;
  timestamp: string;
}

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
  // Debug and mobile detection flags
  const DEBUG = process.env.NODE_ENV === 'development'
  const userAgent = typeof window !== 'undefined' ? navigator.userAgent : ''
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
  const isIPhone = /iPhone/i.test(userAgent)
  const isiPhone16Pro = isIPhone && /iPhone16,2/.test(userAgent)  // Specific iPhone 16 Pro detection
  
  // Performance monitoring
  useEffect(() => {
    if (DEBUG) {
      const deviceInfo: DeviceInfo = {
        environment: process.env.NODE_ENV || 'unknown',
        deviceType: isiPhone16Pro ? 'iPhone 16 Pro' : isIPhone ? 'iPhone' : isMobile ? 'Mobile' : 'Desktop',
        deviceDetails: {
          userAgent,
          platform: navigator.platform,
          vendor: navigator.vendor,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          pixelRatio: window.devicePixelRatio,
          orientation: window.screen.orientation?.type || 'unknown',
          memory: 'Not available'
        },
        timestamp: new Date().toISOString()
      }

      // Safely check and add memory info if available
      try {
        const performance = window.performance as ExtendedPerformance
        if (performance?.memory) {
          const memoryMB: MemoryMetrics = {
            jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024)),
            totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / (1024 * 1024)),
            usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / (1024 * 1024))
          }
          deviceInfo.deviceDetails.memory = memoryMB
        }
      } catch (err) {
        console.debug('Memory metrics not available:', err)
      }

      // Log device-specific debug information
      if (isiPhone16Pro) {
        console.log('iPhone 16 Pro specific debug info:', {
          ...deviceInfo,
          renderingEngine: navigator.vendor,
          touchPoints: navigator.maxTouchPoints,
          devicePixelRatio: window.devicePixelRatio,
          screenSize: {
            width: window.screen.width,
            height: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight
          }
        })
      }

      console.log('App initialized with device info:', deviceInfo)
    }
  }, [])

  const { theme, setTheme } = useTheme()
  const [tickers, setTickers] = useState('')
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Performance monitoring for state changes
  useEffect(() => {
    if (DEBUG) {
      console.log('State updated:', {
        hasStockData: !!stockData,
        dataSize: stockData ? JSON.stringify(stockData).length : 0,
        loading,
        error,
        timestamp: new Date().toISOString()
      })
    }
  }, [stockData, loading, error])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleSubmit = async () => {
    if (DEBUG) {
      console.log('Submit request:', {
        tickers,
        timestamp: new Date().toISOString(),
        isMobile,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    }

    if (!tickers.trim()) {
      setError('Please enter at least one ticker symbol')
      return
    }

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Only update loading state, keep previous data visible during fetch
    setLoading(true)
    setError(null)

    try {
      // Use absolute URL for API requests
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!apiBaseUrl) {
        console.error('API base URL not found in environment');
        throw new Error('API base URL not configured');
      }
      const url = `${apiBaseUrl}/api/stocks/eod`;
      console.log('Making request to:', url);
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`)}`
      };
      
      console.log('Request headers:', headers);
      const response = await fetch(`${url}?symbols=${encodeURIComponent(tickers)}`, {
        method: 'GET',
        headers,
        signal: abortController.signal
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
      // Don't update error state if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      // Keep previous data visible on error
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTickerChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase()
    setTickers(value)
    // Clear any existing error when typing
    setError(null)
    
    // Only update the input value, no other side effects
    if (DEBUG) {
      console.log('Ticker input updated:', {
        value,
        timestamp: new Date().toISOString()
      })
    }
  }, [DEBUG])

  // Transform data for chart with optimized lookups and performance monitoring
  const transformDataForChart = useCallback((data: StockData['data']) => {
    const startTime = performance.now();
    let memoryBefore: any;
    
    if (DEBUG) {
      try {
        memoryBefore = (window.performance as any).memory;
        console.log('Starting data transformation:', {
          dataSize: data.length,
          timestamp: new Date().toISOString(),
          memoryBefore: memoryBefore ? {
            usedJSHeapSize: Math.round(memoryBefore.usedJSHeapSize / (1024 * 1024)),
            totalJSHeapSize: Math.round(memoryBefore.totalJSHeapSize / (1024 * 1024))
          } : 'Not available'
        });
      } catch (err) {
        console.debug('Memory metrics not available:', err);
      }
    }

    // Create Map for O(1) lookups with timing
    const mapStartTime = performance.now();
    const dataMap = new Map(
      data.map(item => {
        // Date is already in ISO format, just parse it once
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString();
        return [`${item.symbol}-${dateStr}`, item.close];
      })
    );
    const mapEndTime = performance.now();

    // Get and sort unique dates with timing
    const datesStartTime = performance.now();
    const uniqueDates = [...new Set(
      data.map(item => new Date(item.date)) // Date is already in ISO format
    )].sort((a, b) => a.getTime() - b.getTime())
      .map(date => date.toLocaleDateString());
    const datesEndTime = performance.now();

    // Get unique symbols with timing
    const symbolsStartTime = performance.now();
    const symbols = [...new Set(data.map(item => item.symbol))];
    const symbolsEndTime = performance.now();

    // Create data points with timing
    const transformStartTime = performance.now();
    const result = uniqueDates.map(date => {
      const dataPoint: ChartDataPoint = { date };
      symbols.forEach(symbol => {
        dataPoint[`${symbol} Close`] = dataMap.get(`${symbol}-${date}`) ?? null;
      });
      return dataPoint;
    });
    const transformEndTime = performance.now();

    if (DEBUG) {
      try {
        const memoryAfter = (window.performance as any).memory;
        console.log('Data transformation complete:', {
          timing: {
            total: transformEndTime - startTime,
            mapCreation: mapEndTime - mapStartTime,
            dateProcessing: datesEndTime - datesStartTime,
            symbolProcessing: symbolsEndTime - symbolsStartTime,
            dataTransform: transformEndTime - transformStartTime
          },
          metrics: {
            uniqueDatesCount: uniqueDates.length,
            symbolsCount: symbols.length,
            dataPointsCount: result.length
          },
          memory: memoryAfter ? {
            usedJSHeapSize: Math.round(memoryAfter.usedJSHeapSize / (1024 * 1024)),
            totalJSHeapSize: Math.round(memoryAfter.totalJSHeapSize / (1024 * 1024)),
            change: Math.round((memoryAfter.usedJSHeapSize - (memoryBefore?.usedJSHeapSize || 0)) / (1024 * 1024))
          } : 'Not available',
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.debug('Memory metrics not available:', err);
      }
    }

    return result;
  }, [DEBUG]);

  // Memoize chart data with performance monitoring
  const chartData = useMemo(() => {
    if (!stockData?.data) return [];
    
    const startTime = performance.now();
    const result = transformDataForChart(stockData.data);
    
    if (DEBUG) {
      console.log('Chart data memoization:', {
        inputSize: stockData.data.length,
        outputSize: result.length,
        processingTime: performance.now() - startTime,
        timestamp: new Date().toISOString()
      });
    }
    
    return result;
  }, [stockData?.data, transformDataForChart, DEBUG]);

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
                <ResponsiveContainer width="100%" height="100%" debounce={isIPhone ? 200 : isMobile ? 150 : 50}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    onMouseMove={(e) => {
                      if (DEBUG && e) {
                        console.log('Chart interaction:', {
                          type: 'mousemove',
                          position: e.activeCoordinate,
                          timestamp: new Date().toISOString(),
                          performance: {
                            fps: Math.round(1000 / (performance.now() - (window as any).lastFrameTime || 0)),
                            memory: (window.performance as any).memory ? {
                              usedJSHeapSize: Math.round((window.performance as any).memory.usedJSHeapSize / (1024 * 1024)),
                              totalJSHeapSize: Math.round((window.performance as any).memory.totalJSHeapSize / (1024 * 1024))
                            } : 'Not available'
                          }
                        });
                        (window as any).lastFrameTime = performance.now();
                      }
                    }}
                    onMouseEnter={() => {
                      if (DEBUG) {
                        console.log('Chart mouse enter:', {
                          timestamp: new Date().toISOString(),
                          dataPoints: chartData.length,
                          visibleSymbols: uniqueSymbols.length
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      if (DEBUG) {
                        console.log('Chart mouse leave:', {
                          timestamp: new Date().toISOString()
                        });
                      }
                    }}
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
                    {uniqueSymbols.map((symbol, idx) => {
                      const startRender = performance.now();
                      const line = (
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
                          onAnimationStart={() => {
                            if (DEBUG) {
                              console.log(`Line render start for ${symbol}:`, {
                                timestamp: new Date().toISOString(),
                                renderTime: performance.now() - startRender
                              });
                            }
                          }}
                          onAnimationEnd={() => {
                            if (DEBUG) {
                              console.log(`Line render complete for ${symbol}:`, {
                                timestamp: new Date().toISOString(),
                                renderTime: performance.now() - startRender
                              });
                            }
                          }}
                        />
                      );
                      if (DEBUG) {
                        console.log(`Line component created for ${symbol}:`, {
                          timestamp: new Date().toISOString(),
                          setupTime: performance.now() - startRender
                        });
                      }
                      return line;
                    })}
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
