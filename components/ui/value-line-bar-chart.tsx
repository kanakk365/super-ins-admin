"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, Cell, XAxis, ReferenceLine, LabelList, YAxis } from "recharts";
import React from "react";
import { AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JetBrains_Mono } from "next/font/google";
import { useMotionValueEvent, useSpring } from "framer-motion";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const CHART_MARGIN = 35;

const chartData = [
  { month: "January", desktop: 342 },
  { month: "February", desktop: 676 },
  { month: "March", desktop: 512 },
  { month: "April", desktop: 629 },
  { month: "May", desktop: 458 },
  { month: "June", desktop: 781 },
  { month: "July", desktop: 394 },
  { month: "August", desktop: 924 },
  { month: "September", desktop: 647 },
  { month: "October", desktop: 532 },
  { month: "November", desktop: 803 },
  { month: "December", desktop: 271 },
  { month: "January", desktop: 342 },
  { month: "February", desktop: 876 },
  { month: "March", desktop: 512 },
  { month: "April", desktop: 629 },
];

const chartConfig = {
  desktop: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type ValueLineBarChartProps = {
  data?: Array<{ month: string; desktop: number }>;
  title?: string;
  subtitle?: string;
  changePercent?: string;
  changeType?: "increase" | "decrease";
};

export function ValueLineBarChart({
  data,
  title,
  subtitle,
  changePercent,
  changeType = "increase"
}: ValueLineBarChartProps = {}) {
  // Filter out "Other" values and process the data
  const chartData = React.useMemo(() => {
    const rawData = data || [
      { month: "January", desktop: 342 },
      { month: "February", desktop: 676 },
      { month: "March", desktop: 512 },
      { month: "April", desktop: 629 },
      { month: "May", desktop: 458 },
      { month: "June", desktop: 781 },
      { month: "July", desktop: 394 },
      { month: "August", desktop: 924 },
      { month: "September", desktop: 647 },
      { month: "October", desktop: 532 },
      { month: "November", desktop: 803 },
      { month: "December", desktop: 271 },
    ];

    // Filter out "Other" values
    return rawData.filter(item => item.month !== "Other");
  }, [data]);

  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined
  );

  const maxValueIndex = React.useMemo(() => {
    // if user is moving mouse over bar then set value to the bar value
    if (activeIndex !== undefined) {
      return { index: activeIndex, value: chartData[activeIndex].desktop };
    }
    // if no active index then set value to max value
    return chartData.reduce(
      (max, data, index) => {
        return data.desktop > max.value ? { index, value: data.desktop } : max;
      },
      { index: 0, value: 0 }
    );
  }, [activeIndex]);

  const maxValueIndexSpring = useSpring(maxValueIndex.value, {
    stiffness: 100,
    damping: 20,
  });

  const [springyValue, setSpringyValue] = React.useState(maxValueIndex.value);

  useMotionValueEvent(maxValueIndexSpring, "change", (latest) => {
    setSpringyValue(Number(latest.toFixed(0)));
  });

  React.useEffect(() => {
    maxValueIndexSpring.set(maxValueIndex.value);
  }, [maxValueIndex.value, maxValueIndexSpring]);

  const BAR_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span
            className={cn(jetBrainsMono.className, "text-2xl tracking-tighter")}
          >
            {title ?? "Key Performance Indicators"}
          </span>
          {changePercent && (
            <Badge variant="secondary">
              {changeType === "increase" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{changePercent}</span>
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{subtitle ?? "Maximum values across different educational metrics"}</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              onMouseLeave={() => setActiveIndex(undefined)}
              margin={{
                left: CHART_MARGIN,
              }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                hide={false}
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                tickCount={5}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                {chartData.map((_, index) => (
                  <linearGradient id={`kpi-bar-${index}`} x1="0" y1="0" x2="0" y2="1" key={index}>
                    <stop offset="0%" stopColor={BAR_COLORS[index % BAR_COLORS.length]} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={BAR_COLORS[index % BAR_COLORS.length]} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <Bar dataKey="desktop" radius={[6, 6, 0, 0]} isAnimationActive>
                <LabelList dataKey="desktop" position="top" className={cn(jetBrainsMono.className, "fill-foreground text-[10px]")} />
                {chartData.map((_, index) => (
                  <Cell
                    className="duration-200"
                    fill={`url(#kpi-bar-${index})`}
                    opacity={index === maxValueIndex.index ? 1 : 0.6}
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                  />
                ))}
              </Bar>
              <ReferenceLine
                opacity={0.4}
                y={springyValue}
                stroke="hsl(var(--chart-1))"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={<CustomReferenceLabel value={maxValueIndex.value} />}
              />
            </BarChart>
          </ChartContainer>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface CustomReferenceLabelProps {
  viewBox?: {
    x?: number;
    y?: number;
  };
  value: number;
}

const CustomReferenceLabel: React.FC<CustomReferenceLabelProps> = (props) => {
  const { viewBox, value } = props;
  const x = viewBox?.x ?? 0;
  const y = viewBox?.y ?? 0;

  // we need to change width based on value length
  const width = React.useMemo(() => {
    const characterWidth = 8; // Average width of a character in pixels
    const padding = 10;
    return value.toString().length * characterWidth + padding;
  }, [value]);

  return (
    <>
      <rect
        x={x - CHART_MARGIN}
        y={y - 9}
        width={width}
        height={18}
        fill="hsl(var(--chart-1))"
        rx={4}
      />
      <text
        fontWeight={600}
        x={x - CHART_MARGIN + 6}
        y={y + 4}
        fill="hsl(var(--background))"
      >
        {value}
      </text>
    </>
  );
};
