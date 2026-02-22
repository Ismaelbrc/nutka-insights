import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}

const Sparkline = ({ data, positive = true, width = 80, height = 28 }: SparklineProps) => {
  const chartData = data.map((value, i) => ({ i, v: value }));
  const color = positive ? "hsl(142, 71%, 45%)" : "hsl(0, 72%, 51%)";

  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`spark-${positive ? 'p' : 'n'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${positive ? 'p' : 'n'})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Sparkline;
