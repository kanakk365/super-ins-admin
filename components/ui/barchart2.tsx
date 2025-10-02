"use client"

import { TrendingUp, Building2, GraduationCap, Users } from "lucide-react"
import { useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const description = "A bar chart for student performance categories"

interface StudentPerformanceData {
  subject: string;
  dull: number;
  normal: number;
  good: number;
  excellent: number;
}

const baseChartData: StudentPerformanceData[] = [
  { subject: "Maths", dull: 45, normal: 120, good: 85, excellent: 35 },
  { subject: "Physics", dull: 38, normal: 105, good: 92, excellent: 28 },
  { subject: "Chemistry", dull: 42, normal: 115, good: 78, excellent: 32 },
  { subject: "Biology", dull: 35, normal: 98, good: 88, excellent: 41 },
  { subject: "Zoology", dull: 48, normal: 112, good: 75, excellent: 29 },
  { subject: "History", dull: 52, normal: 125, good: 68, excellent: 25 },
  { subject: "Economics", dull: 41, normal: 108, good: 82, excellent: 36 },
  { subject: "Civics", dull: 46, normal: 118, good: 71, excellent: 31 },
  { subject: "Geography", dull: 39, normal: 102, good: 89, excellent: 33 },
  { subject: "English", dull: 34, normal: 95, good: 95, excellent: 45 },
]

const chartConfig = {
  dull: {
    label: "Dull (0-50)",
    color: "hsl(var(--chart-1))",
  },
  normal: {
    label: "Normal (51-75)",
    color: "hsl(var(--chart-2))",
  },
  good: {
    label: "Good (76-90)",
    color: "hsl(var(--chart-3))",
  },
  excellent: {
    label: "Excellent (91-100)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

interface BarGraphSectionProps {
  institutions?: Array<{id: string, name: string}>;
  grades?: Array<{id: string, name: string}>;
  sections?: Array<{id: string, name: string}>;
  onFilterChange?: (filters: {institution?: string, grade?: string, section?: string}) => void;
}

export function BarGraphSection({
  institutions = [
    { id: "inst-001", name: "Alpha Institute" },
    { id: "inst-002", name: "Beta College" }
  ],
  grades = [
    { id: "1", name: "Grade 1" },
    { id: "2", name: "Grade 2" },
    { id: "3", name: "Grade 3" },
    { id: "4", name: "Grade 4" },
    { id: "5", name: "Grade 5" }
  ],
  sections = [
    { id: "A", name: "Section A" },
    { id: "B", name: "Section B" },
    { id: "C", name: "Section C" }
  ],
  onFilterChange
}: BarGraphSectionProps) {
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let data = [...baseChartData];

    // Apply filters if selected
    if (selectedInstitution) {
      // In a real app, you'd filter based on actual institution data
      // For now, we'll just use the base data
    }

    if (selectedGrade) {
      // Filter subjects based on grade level
      // For demo purposes, we'll show different distributions for different grades
      const gradeMultipliers = {
        "1": { dull: 1.2, normal: 1.1, good: 0.9, excellent: 0.8 },
        "2": { dull: 1.1, normal: 1.0, good: 1.0, excellent: 0.9 },
        "3": { dull: 1.0, normal: 1.0, good: 1.0, excellent: 1.0 },
        "4": { dull: 0.9, normal: 1.0, good: 1.1, excellent: 1.1 },
        "5": { dull: 0.8, normal: 0.9, good: 1.2, excellent: 1.3 }
      };

      const multiplier = gradeMultipliers[selectedGrade as keyof typeof gradeMultipliers] || { dull: 1, normal: 1, good: 1, excellent: 1 };

      data = data.map(item => ({
        ...item,
        dull: Math.floor(item.dull * multiplier.dull),
        normal: Math.floor(item.normal * multiplier.normal),
        good: Math.floor(item.good * multiplier.good),
        excellent: Math.floor(item.excellent * multiplier.excellent)
      }));
    }

    if (selectedSection) {
      // Apply section-based filtering
      const sectionMultipliers = {
        "A": { dull: 0.9, normal: 1.0, good: 1.1, excellent: 1.2 },
        "B": { dull: 1.0, normal: 1.0, good: 1.0, excellent: 1.0 },
        "C": { dull: 1.1, normal: 1.0, good: 0.9, excellent: 0.8 }
      };

      const multiplier = sectionMultipliers[selectedSection as keyof typeof sectionMultipliers] || { dull: 1, normal: 1, good: 1, excellent: 1 };

      data = data.map(item => ({
        ...item,
        dull: Math.floor(item.dull * multiplier.dull),
        normal: Math.floor(item.normal * multiplier.normal),
        good: Math.floor(item.good * multiplier.good),
        excellent: Math.floor(item.excellent * multiplier.excellent)
      }));
    }

    return data;
  }, [selectedInstitution, selectedGrade, selectedSection]);

  const handleFilterChange = () => {
    const filters: any = {};
    if (selectedInstitution) filters.institution = selectedInstitution;
    if (selectedGrade) filters.grade = selectedGrade;
    if (selectedSection) filters.section = selectedSection;
    onFilterChange?.(filters);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Student Performance Analytics
              </CardTitle>
              <CardDescription>
                Performance distribution across subjects by student categories
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Filters
              <Badge variant="secondary">{[selectedInstitution, selectedGrade, selectedSection].filter(Boolean).length}</Badge>
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Institution Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Institution
                </label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => {
                    setSelectedInstitution(e.target.value);
                    handleFilterChange();
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">All Institutions</option>
                  {institutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Grade
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    handleFilterChange();
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">All Grades</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    handleFilterChange();
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">All Sections</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedInstitution || selectedGrade || selectedSection) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
                {selectedInstitution && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {institutions.find(i => i.id === selectedInstitution)?.name}
                  </Badge>
                )}
                {selectedGrade && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {grades.find(g => g.id === selectedGrade)?.name}
                  </Badge>
                )}
                {selectedSection && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {sections.find(s => s.id === selectedSection)?.name}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Student Performance by Subject</CardTitle>
          <CardDescription>
            Distribution of students across performance categories for each subject
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer config={chartConfig} className="min-h-[400px]">
            <BarChart
              accessibilityLayer
              data={filteredData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="subject"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="excellent"
                stackId="a"
                fill="var(--color-excellent)"
                radius={[0, 0, 8, 8]}
              />
              <Bar
                dataKey="good"
                stackId="a"
                fill="var(--color-good)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="normal"
                stackId="a"
                fill="var(--color-normal)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="dull"
                stackId="a"
                fill="var(--color-dull)"
                radius={[12, 12, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

    </div>
  )
}
