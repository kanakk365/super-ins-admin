"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { TrendingUp, TrendingDown } from "lucide-react";

export type QuizTrendPoint = { label: string; score: number };

type PingingDotChartProps = {
  data: QuizTrendPoint[];
  title?: string;
  subtitle?: string;
  changePercent?: string;
  changeType?: "increase" | "decrease";
};

const fallbackData: QuizTrendPoint[] = [
  { label: "Quiz 1", score: 75 },
  { label: "Quiz 2", score: 82 },
  { label: "Quiz 3", score: 68 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function PingingDotChart({
  data,
  title,
  subtitle,
  changePercent,
  changeType = "increase"
}: PingingDotChartProps) {
  const chartData = (data && data.length > 0 ? data : fallbackData).map((d) => ({
    month: d.label,
    score: d.score,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title ?? "Quiz Performance Trends"}
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
        <CardDescription>{subtitle ?? "Recent quiz scores and trends"}</CardDescription>
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
              tickFormatter={(value) => value}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="score"
              type="linear"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={<CustomizedDot />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomizedDot = (props: React.SVGProps<SVGCircleElement>) => {
  const { cx, cy } = props;
  const greenColor = "hsl(var(--chart-2))"; // Use the green color from config

  return (
    <g>
      {/* Main dot */}
      <circle cx={cx} cy={cy} r={5} fill={greenColor} />
      {/* Ping animation circles */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        stroke={greenColor}
        fill="none"
        strokeWidth="2"
        opacity="0.7"
      >
        <animate
          attributeName="r"
          values="5;15"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.7;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Additional pulse ring */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        stroke={greenColor}
        fill="none"
        strokeWidth="1"
        opacity="0.4"
      >
        <animate
          attributeName="r"
          values="5;20"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
};
