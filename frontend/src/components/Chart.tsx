import type { FC, JSX } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface ChartDataPoint {
  date: string;
  [key: string]: string | number | null;
}

interface ChartProps {
  data: ChartDataPoint[];
  theme?: string;
  isMobile?: boolean;
  uniqueSymbols: string[];
  colors?: string[];
}

const defaultProps: Partial<ChartProps> = {
  theme: 'light',
  isMobile: false,
  colors: ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c']
}

export const Chart: FC<ChartProps> = ({ 
  data, 
  theme = defaultProps.theme, 
  isMobile = defaultProps.isMobile, 
  uniqueSymbols, 
  colors = defaultProps.colors 
}: ChartProps): JSX.Element => {
  // Ensure colors is always defined with a fallback
  const safeColors = colors || defaultProps.colors!
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Stock Price History</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%" debounce={isMobile ? 150 : 50}>
          <LineChart
            data={data}
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
                stroke={safeColors[idx % safeColors.length]}
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
  )
}
