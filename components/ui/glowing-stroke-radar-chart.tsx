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
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface StudentGradeData {
  grade: string;
  strength: number;
}

interface GlowingStrokeRadarChartProps {
  data: StudentGradeData[];
}

const chartConfig = {
  strength: {
    label: "Students",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function GlowingStrokeRadarChart({ data }: GlowingStrokeRadarChartProps) {
  const totalStudents = data.reduce((sum, item) => sum + item.strength, 0);
  const maxStudents = Math.max(...data.map(item => item.strength));
  const avgStudents = Math.round(totalStudents / data.length);

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle className="flex items-center gap-2">
         
          Student Distribution 
         
        </CardTitle>
        
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] min-h-[300px]"
        >
          <RadarChart data={data}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <PolarAngleAxis
              dataKey="grade"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              className="text-xs"
            />
            <PolarGrid
              strokeDasharray="1 1"
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
            <Radar
              stroke="url(#radarGradient)"
              strokeWidth={3}
              dataKey="strength"
              fill="url(#radarFill)"
              fillOpacity={0.2}
              filter="url(#radarGlow)"
              dot={{
                fill: 'hsl(var(--chart-1))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
                r: 4
              }}
            />
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="50%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
              </linearGradient>
              <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="70%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0.05} />
              </radialGradient>
              <filter
                id="radarGlow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
