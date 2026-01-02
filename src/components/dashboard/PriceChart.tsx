import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", price: 65200 },
  { time: "04:00", price: 65800 },
  { time: "08:00", price: 66400 },
  { time: "12:00", price: 65900 },
  { time: "16:00", price: 67100 },
  { time: "20:00", price: 67500 },
  { time: "Now", price: 67432 },
];

const PriceChart = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">BTC/USD</h3>
          <p className="text-sm text-muted-foreground">24h Price Movement</p>
        </div>
        <div className="flex gap-2">
          {["1H", "24H", "7D", "1M", "1Y"].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                period === "24H" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(187, 92%, 55%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(187, 92%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
            />
            <YAxis 
              domain={["dataMin - 500", "dataMax + 500"]}
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                background: "hsl(222, 47%, 10%)", 
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 96%)"
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(187, 92%, 55%)" 
              strokeWidth={2}
              fill="url(#priceGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
