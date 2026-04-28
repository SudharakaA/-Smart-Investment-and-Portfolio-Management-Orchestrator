import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const data = [
  { name: "Stocks", value: 45, color: "hsl(187, 92%, 55%)" },
  { name: "Crypto", value: 25, color: "hsl(160, 72%, 45%)" },
  { name: "Bonds", value: 15, color: "hsl(38, 92%, 55%)" },
  { name: "Commodities", value: 10, color: "hsl(280, 72%, 55%)" },
  { name: "Cash", value: 5, color: "hsl(215, 20%, 55%)" },
];

const PortfolioChart = () => {
  const totalValue = 247_832;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = data[activeIndex] ?? data[0];

  const activeValue = useMemo(
    () => Math.round((totalValue * activeItem.value) / 100),
    [activeItem.value],
  );

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Portfolio Allocation</h3>
          <p className="text-sm text-muted-foreground">Current distribution</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono">${totalValue.toLocaleString()}</p>
          <p className="text-sm text-success font-mono">+12.4% YTD</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="relative w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={112}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={2}
                stroke="hsl(222, 47%, 6%)"
                activeIndex={activeIndex}
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className={cn(
                      "transition-all duration-200",
                      index === activeIndex ? "opacity-100" : "opacity-70",
                    )}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Popup contents inside chart */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 rounded-xl border border-border/70 bg-card/95 backdrop-blur p-3 text-center shadow-lg">
              <p className="text-xs text-muted-foreground mb-1">Selected Asset</p>
              <p className="font-semibold">{activeItem.name}</p>
              <p className="text-lg font-mono text-primary mt-1">{activeItem.value}%</p>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                ${activeValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3 w-full">
          {data.map((item, index) => {
            const itemValue = Math.round((totalValue * item.value) / 100);
            return (
            <button
              key={item.name}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-lg transition-colors text-left",
                index === activeIndex ? "bg-secondary/70 border border-border/60" : "hover:bg-secondary/30 border border-transparent",
              )}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm">{item.value}%</p>
                <p className="text-[11px] text-muted-foreground font-mono">${itemValue.toLocaleString()}</p>
              </div>
            </button>
          )})}
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;
