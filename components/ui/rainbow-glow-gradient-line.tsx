"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

export type GrowthPoint = { month: string; students: number };

type RainbowGlowGradientLineChartProps = {
  data: GrowthPoint[];
  title?: string;
  subtitle?: string;
  changePercent?: string;
  changeType?: "increase" | "decrease";
};

// Fallback demo data if none provided
const fallbackData: GrowthPoint[] = [
  { month: "Jan", students: 186 },
  { month: "Feb", students: 305 },
  { month: "Mar", students: 237 },
  { month: "Apr", students: 73 },
  { month: "May", students: 209 },
  { month: "Jun", students: 214 },
];

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  students: {
    label: "Students",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RainbowGlowGradientLineChart({
  data,
  title,
  subtitle,
  changePercent,
  changeType = "increase"
}: RainbowGlowGradientLineChartProps) {
  const chartData = (data && data.length > 0 ? data : fallbackData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title ?? "Student Growth Trends"}
          {changePercent && (
            <Badge
              variant="outline"
              className={`${
                changeType === "increase"
                  ? "text-green-500 bg-green-500/10"
                  : "text-red-500 bg-red-500/10"
              } border-none ml-2`}
            >
              {changeType === "increase" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{changePercent}</span>
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{subtitle ?? "Monthly student enrollment growth"}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="students"
              type="bump"
              stroke="url(#colorUv)"
              dot={false}
              strokeWidth={2}
              filter="url(#rainbow-line-glow)"
            />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#006A3D" stopOpacity={0.8} />
                <stop offset="25%" stopColor="#2E8B57" stopOpacity={0.8} />
                <stop offset="50%" stopColor="#4CAF75" stopOpacity={0.8} />
                <stop offset="75%" stopColor="#66BB6A" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#81C784" stopOpacity={0.8} />
              </linearGradient>
              <filter
                id="rainbow-line-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
