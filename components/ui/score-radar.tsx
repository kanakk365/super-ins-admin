"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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

type ScoreDistribution = {
  metric: string; // e.g., "Low", "Average", "High"
  value: number;
};

type ScoreRadarProps = {
  title: string;
  subtitle?: string;
  data: ScoreDistribution[];
  colorVar?: string; // CSS var token like --chart-1
};

export function ScoreRadar({ title, subtitle, data, colorVar = "--chart-2" }: ScoreRadarProps) {
  const config: ChartConfig = {
    score: {
      label: "Score",
      theme: {
        light: `hsl(var(${colorVar}))`,
        dark: `hsl(var(${colorVar}))`,
      },
    },
  };

  // recharts expects keys; map value under a fixed key
  const chartData = data.map((d) => ({ month: d.metric, score: d.value }));

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
        {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[260px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarGrid
              gridType="polygon"
              radialLines={true}
            />
            <Radar dataKey="score" fill="var(--color-score)" fillOpacity={0.6} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


