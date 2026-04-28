import { useCallback, useEffect, useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api";

type TimeRange = "1H" | "24H" | "7D" | "1M" | "1Y";

interface HistoryPoint {
  timestamp: number;
  price: number;
}

interface ChartPoint extends HistoryPoint {
  label: string;
}

const ranges: TimeRange[] = ["1H", "24H", "7D", "1M", "1Y"];

const formatXAxisLabel = (timestamp: number, range: TimeRange) => {
  const date = new Date(timestamp);
  if (range === "1H" || range === "24H") {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  if (range === "7D" || range === "1M") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", { month: "short" });
};

const PriceChart = () => {
  const [range, setRange] = useState<TimeRange>("24H");
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [changePercent, setChangePercent] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(
        apiUrl(`/api/crypto/history?symbol=BTC&range=${encodeURIComponent(range)}`),
      );

      if (!response.ok) {
        throw new Error(`History API returned ${response.status}`);
      }

      const data = await response.json();
      const chartData: ChartPoint[] = (data?.points ?? []).map((point: HistoryPoint) => ({
        ...point,
        label: formatXAxisLabel(point.timestamp, range),
      }));

      setPoints(chartData);
      setCurrentPrice(typeof data?.currentPrice === "number" ? data.currentPrice : null);
      setChangePercent(typeof data?.changePercent === "number" ? data.changePercent : 0);
      setLastUpdate(new Date(data?.timestamp ?? Date.now()));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch BTC history");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    setLoading(true);
    fetchHistory();
    const interval = setInterval(fetchHistory, 15000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  const subtitle = useMemo(() => `${range} Price Movement`, [range]);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">BTC/USD</h3>
          <p className="text-sm text-muted-foreground">
            {subtitle}
            {lastUpdate && <span className="ml-2">• Updated {lastUpdate.toLocaleTimeString()}</span>}
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-xl">${currentPrice?.toLocaleString("en-US", { maximumFractionDigits: 2 }) ?? "--"}</div>
          <div
            className={cn(
              "text-xs font-mono inline-flex items-center gap-1",
              changePercent >= 0 ? "text-success" : "text-destructive",
            )}
          >
            {changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {ranges.map((period) => (
          <button
            key={period}
            onClick={() => setRange(period)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
              period === range
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {loading && points.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {error && (
            <p className="text-xs text-destructive mb-3">
              {error}
            </p>
          )}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(187, 92%, 55%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(187, 92%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                  tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
                />
                <YAxis
                  domain={["dataMin", "dataMax"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
                  tickFormatter={(value) => `$${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(222, 47%, 10%)",
                    border: "1px solid hsl(222, 30%, 18%)",
                    borderRadius: "8px",
                    color: "hsl(210, 40%, 96%)",
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
                    "Price",
                  ]}
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
        </>
      )}
    </div>
  );
};

export default PriceChart;
