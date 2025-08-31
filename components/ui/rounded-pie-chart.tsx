"use client";

import { LabelList, Pie, PieChart } from "recharts";

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

export const description = "A pie chart with a label list";

export type PieDatum = { label: string; value: number };

type RoundedPieChartProps = {
  data: PieDatum[];
  title?: string;
  subtitle?: string;
  changePercent?: string;
  changeType?: "increase" | "decrease";
};

const fallbackData: PieDatum[] = [
  { label: "A", value: 30 },
  { label: "B", value: 40 },
  { label: "C", value: 20 },
];

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  chrome: {
    label: "Chrome",
    color: "hsl(142, 76%, 36%)", // Dark green
  },
  safari: {
    label: "Safari", 
    color: "hsl(142, 76%, 46%)", // Medium green
  },
  firefox: {
    label: "Firefox",
    color: "hsl(142, 76%, 56%)", // Light green
  },
  edge: {
    label: "Edge",
    color: "hsl(142, 76%, 66%)", // Lighter green
  },
  other: {
    label: "Other",
    color: "hsl(142, 76%, 76%)", // Very light green
  },
} satisfies ChartConfig;

export function RoundedPieChart({
  data,
  title,
  subtitle,
  changePercent,
  changeType = "increase"
}: RoundedPieChartProps) {
  const chartData = (data && data.length > 0 ? data : fallbackData).map((d, idx) => {
    const colorKeys = ['chrome', 'safari', 'firefox', 'edge', 'other'];
    const colorKey = colorKeys[idx % colorKeys.length];
    return {
      label: d.label,
      value: d.value,
      fill: `var(--color-${colorKey})`,
    };
  });
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          {title ?? "Completion Rates"}
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
        <CardDescription>{subtitle ?? "Overview"}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie
              data={chartData}
              innerRadius={30}
              dataKey="value"
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey="value"
                stroke="none"
                fontSize={12}
                fontWeight={500}
                fill="currentColor"
                formatter={(value: number) => value.toString()}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
