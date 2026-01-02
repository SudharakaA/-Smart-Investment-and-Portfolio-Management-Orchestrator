import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Stocks", value: 45, color: "hsl(187, 92%, 55%)" },
  { name: "Crypto", value: 25, color: "hsl(160, 72%, 45%)" },
  { name: "Bonds", value: 15, color: "hsl(38, 92%, 55%)" },
  { name: "Commodities", value: 10, color: "hsl(280, 72%, 55%)" },
  { name: "Cash", value: 5, color: "hsl(215, 20%, 55%)" },
];

const PortfolioChart = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Portfolio Allocation</h3>
          <p className="text-sm text-muted-foreground">Current distribution</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono">$247,832</p>
          <p className="text-sm text-success font-mono">+12.4% YTD</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: "hsl(222, 47%, 10%)", 
                  border: "1px solid hsl(222, 30%, 18%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 96%)"
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-mono text-sm">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;
