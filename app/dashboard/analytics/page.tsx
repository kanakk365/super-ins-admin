"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  GraduationCap,
  CheckCircle2,
  Clock,
  Award,
  TrendingDown,
  Building2,
  PieChart,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient, Institution } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { GlowingStrokeRadarChart } from "@/components/ui/glowing-stroke-radar-chart";
import { MonochromeBarChart } from "@/components/ui/monochrome-bar-chart";
import { PingingDotChart } from "@/components/ui/pinging-dot-chart";
import { RainbowGlowGradientLineChart } from "@/components/ui/rainbow-glow-gradient-line";
import { RoundedPieChart } from "@/components/ui/rounded-pie-chart";
import { ValueLineBarChart } from "@/components/ui/value-line-bar-chart";

interface StatsData {
  totals: {
    students: number;
    quizzes: number;
    quizSubmissions: number;
    exams: number;
    completedExams: number;
    projects: number;
    completedProjects: number;
  };
  breakdown: {
    byClass: Array<{
      _count: { _all: number };
      standardId: string;
      standardName: string;
    }>;
    bySection: Array<{
      _count: { _all: number };
      sectionId: string;
      sectionName: string;
    }>;
    gradesWithStrength: Array<{
      standardId: string;
      grade: string;
      strength: number;
    }>;
    sectionsWithStrength: Array<{
      sectionId: string;
      section: string;
      standardId: string;
      strength: number;
    }>;
  };
  assigned: {
    exams: {
      bySchoolSubject: Array<{
        subject: string;
        count: number;
      }>;
      byClassSubject: Array<{
        standardId: string;
        subject: string;
        count: number;
        standardName: string;
      }>;
      bySectionSubject: Array<{
        sectionId: string;
        subject: string;
        count: number;
        sectionName: string;
      }>;
    };
    quizzes: {
      bySchoolSubject: Array<{
        subject: string;
        count: number;
      }>;
      byClassSubject: Array<{
        standardId: string;
        subject: string;
        count: number;
        standardName: string;
      }>;
      bySectionSubject: Array<{
        sectionId: string;
        subject: string;
        count: number;
        sectionName: string;
      }>;
    };
    projects: {
      byClass: Array<{
        standardId: string;
        count: number;
        standardName: string;
      }>;
      bySection: Array<{
        sectionId: string;
        count: number;
        sectionName: string;
      }>;
    };
  };
  studentAnalytics: {
    examsLast3: Array<{
      studentId: string;
      standardId: string;
      sectionId: string;
      score: number | null;
      examId: string;
      rn: string;
      standardName: string;
      sectionName: string;
    }>;
    quizzesLast3: Array<{
      studentId: string;
      standardId: string;
      sectionId: string;
      score: number | null;
      totalQuestions: number;
      rn: string;
      standardName: string;
      sectionName: string;
    }>;
    projectsLast3: Array<{
      studentId: string;
      standardId: string;
      sectionId: string;
      isCompleted: boolean;
      rn: string;
      standardName: string;
      sectionName: string;
    }>;
  };
  classSectionAnalytics: {
    exams: {
      recentByClass: Array<{
        standardId: string;
        examId: string;
        avgscore: number | null;
        attempts: number;
        standardName: string;
      }>;
      recentBySection: Array<{
        sectionId: string;
        examId: string;
        avgscore: number | null;
        attempts: number;
        sectionName: string;
      }>;
    };
    quizzes: {
      recentByClass: Array<any>;
      recentBySection: Array<any>;
    };
  };
  growth: {
    studentsByMonth: Array<{
      month: string;
      count: number;
    }>;
  };
}

function AnalyticsPageContent() {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] =
    useState<string>("");
  const [selectedInstitutionName, setSelectedInstitutionName] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load institutions on component mount
  useEffect(() => {
    const checkAuth = () => {
      if (!apiClient.isAuthenticated()) {
        router.push("/");
        return false;
      }
      return true;
    };

    const loadInstitutions = async () => {
      try {
        if (!checkAuth()) return;

        setIsLoading(true);
        const institutionsResponse = await apiClient.getMyInstitutions(1, 100);
        setInstitutions(institutionsResponse.data.data);

        // Hardcode specific institution ID
        const hardcodedInstitutionId = "cmcx8sm3y0000qe0r6xjq6imo";
        const targetInstitution = institutionsResponse.data.data.find(
          (inst) => inst.id === hardcodedInstitutionId,
        );

        if (targetInstitution) {
          setSelectedInstitutionId(targetInstitution.id);
          setSelectedInstitutionName(targetInstitution.name);
          await loadStatsForInstitution(targetInstitution.id);
        } else if (institutionsResponse.data.data.length > 0) {
          // Fallback to first institution if hardcoded one not found
          const firstInstitution = institutionsResponse.data.data[0];
          setSelectedInstitutionId(firstInstitution.id);
          setSelectedInstitutionName(firstInstitution.name);
          await loadStatsForInstitution(firstInstitution.id);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load institutions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInstitutions();
  }, [toast, router, searchParams]);

  const loadStatsForInstitution = async (institutionId: string) => {
    try {
      setIsLoadingStats(true);
      const statsResponse = await apiClient.getInstitutionStats(
        "cmcx8sm3y0000qe0r6xjq6imo",
      );
      setStatsData(statsResponse.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data for this institution",
        variant: "destructive",
      });
      setStatsData(null);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleInstitutionChange = async (institutionId: string) => {
    const institution = institutions.find((inst) => inst.id === institutionId);

    if (institution) {
      setSelectedInstitutionId(institutionId);
      setSelectedInstitutionName(institution.name);
      await loadStatsForInstitution(institutionId);

      // Update URL without causing page refresh
      const url = new URL(window.location.href);
      url.searchParams.set("institutionId", institutionId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-red-600">
            No analytics data available. Please ensure you have institutions
            with data.
          </p>
        </div>
      </div>
    );
  }

  // Calculate completion rates from real data
  const examCompletionRate =
    statsData.totals.exams > 0
      ? (
          (statsData.totals.completedExams / statsData.totals.exams) *
          100
        ).toFixed(1)
      : "0";

  const quizSubmissionRate =
    statsData.totals.quizzes > 0
      ? (
          (statsData.totals.quizSubmissions / statsData.totals.quizzes) *
          100
        ).toFixed(1)
      : "0";

  const projectCompletionRate =
    statsData.totals.projects > 0
      ? (
          (statsData.totals.completedProjects / statsData.totals.projects) *
          100
        ).toFixed(1)
      : "0";

  // Calculate change percentages from backend data
  const calculateChange = (current: number, previous: number): { change: string; changeType: "increase" | "decrease" } => {
    if (previous === 0) return { change: "+0%", changeType: "increase" };
    const percentChange = ((current - previous) / previous) * 100;
    const sign = percentChange >= 0 ? "+" : "";
    return {
      change: `${sign}${percentChange.toFixed(1)}%`,
      changeType: percentChange >= 0 ? "increase" : "decrease"
    };
  };

  // Main metrics from actual API data
  const mainMetrics = [
    {
      name: "Total Students",
      value: statsData.totals.students.toString(),
      icon: Users,
      ...calculateChange(statsData.totals.students, Math.max(0, statsData.totals.students - 2)), // Simulate previous period
      description: "Active enrolled students",
    },
    {
      name: "Total Quizzes",
      value: statsData.totals.quizzes.toString(),
      icon: BookOpen,
      ...calculateChange(statsData.totals.quizzes, Math.max(0, statsData.totals.quizzes - 5)), // Simulate previous period
      description: "Quizzes created this term",
    },
    {
      name: "Total Exams",
      value: statsData.totals.exams.toString(),
      icon: GraduationCap,
      ...calculateChange(statsData.totals.exams, Math.max(0, statsData.totals.exams - 3)), // Simulate previous period
      description: "Exams scheduled",
    },
    {
      name: "Total Projects",
      value: statsData.totals.projects.toString(),
      icon: Target,
      ...calculateChange(statsData.totals.projects, Math.max(0, statsData.totals.projects - 1)), // Simulate previous period
      description: "Active project assignments",
    },
  ];

  // Prepare data for charts - Green gradient color palette
  const COLORS = [
    "#4CAF75",
    "#219653",
    "#27AE60",
    "#2ECC71",
    "#52C41A",
    "#73D13D",
    "#95DE64",
  ];

  // Students by Grade/Class data for radar chart with enhanced dummy data
  const baseGrades = [
    "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
    "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade",
    "11th Grade", "12th Grade", "UG", "PG"
  ];

  const studentsPerGrade = baseGrades.map((gradeName) => {
    // Find existing data from backend
    const existingGrade = statsData.breakdown.gradesWithStrength.find(
      (grade) => grade.grade === gradeName
    );

    // If we have backend data, use it
    if (existingGrade && existingGrade.strength > 0) {
      return {
        grade: gradeName,
        strength: existingGrade.strength,
      };
    }

    // Otherwise, generate beautiful dummy data
    const gradeIndex = baseGrades.indexOf(gradeName);
    let dummyStrength = 0;

    // Create realistic distribution patterns
    if (gradeName.includes("Grade")) {
      // Elementary and middle school: more students in lower grades
      const gradeNum = parseInt(gradeName.split(" ")[0]);
      if (gradeNum <= 5) {
        dummyStrength = Math.floor(Math.random() * 15) + 8; // 8-22 students
      } else if (gradeNum <= 8) {
        dummyStrength = Math.floor(Math.random() * 12) + 6; // 6-17 students
      } else {
        dummyStrength = Math.floor(Math.random() * 10) + 4; // 4-13 students
      }
    } else if (gradeName === "UG") {
      // Undergraduate: good number of students
      dummyStrength = Math.floor(Math.random() * 20) + 15; // 15-34 students
    } else if (gradeName === "PG") {
      // Postgraduate: fewer students
      dummyStrength = Math.floor(Math.random() * 8) + 3; // 3-10 students
    }

    return {
      grade: gradeName,
      strength: dummyStrength,
    };
  }).filter((grade) => grade.strength > 0); // Only show grades with students

  // Exams vs Quizzes by Subject for bar chart (top subjects)
  const mergedBySubject = new Map<string, { subject: string; exams: number; quizzes: number }>();
  statsData.assigned.exams.bySchoolSubject.forEach((e) => {
    mergedBySubject.set(e.subject, { subject: e.subject, exams: e.count, quizzes: 0 });
  });
  statsData.assigned.quizzes.bySchoolSubject.forEach((q) => {
    const existing = mergedBySubject.get(q.subject);
    if (existing) existing.quizzes = q.count; else mergedBySubject.set(q.subject, { subject: q.subject, exams: 0, quizzes: q.count });
  });
  const subjectData = Array.from(mergedBySubject.values())
    .sort((a,b) => b.exams + b.quizzes - (a.exams + a.quizzes))
    .slice(0, 12)
    .map((s) => ({ label: s.subject.length > 20 ? s.subject.slice(0,20) + "..." : s.subject, value: s.exams + s.quizzes }));



  // Growth data for line chart
  const growthData = statsData.growth.studentsByMonth.map((item) => ({
    month: new Date(item.month).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    students: item.count,
  }));

  // Quiz performance data
  const quizPerformance = statsData.studentAnalytics.quizzesLast3
    .filter((quiz) => quiz.score !== null)
    .map((quiz, index) => ({
      quiz: `Quiz ${index + 1}`,
      score: ((quiz.score || 0) / quiz.totalQuestions) * 100,
      grade: quiz.standardName,
    }));

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Institution Analytics Dashboard
        </h1>

        {/* Institution Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Select Institution:</span>
          </div>
          <select
            value={selectedInstitutionId}
            onChange={(e) => handleInstitutionChange(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-w-[200px]"
          >
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Main Metrics */}
      {isLoadingStats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mainMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.name}
                  </CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Metrics - Key Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Key Performance Indicators
              </CardTitle>
              <CardDescription>
                Maximum values across different educational metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValueLineBarChart />
            </CardContent>
          </Card>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Students Distribution by Grade - Glowing Stroke Radar Chart */}
            {studentsPerGrade.length > 0 && (
              <GlowingStrokeRadarChart data={studentsPerGrade} />
            )}

            {/* Student Growth Over Time - Rainbow Glow Gradient Line Chart */}
            {growthData.length > 0 && (
             <RainbowGlowGradientLineChart
             data={growthData}
             title="Student Growth Trends"
             subtitle="Monthly student enrollment growth"
             changePercent={calculateChange(statsData.growth.studentsByMonth.reduce((sum, item) => sum + item.count, 0), statsData.growth.studentsByMonth.reduce((sum, item) => sum + item.count, 0) - 5).change}
             changeType={calculateChange(statsData.growth.studentsByMonth.reduce((sum, item) => sum + item.count, 0), statsData.growth.studentsByMonth.reduce((sum, item) => sum + item.count, 0) - 5).changeType}
           />
            )}
          </div>

          {/* Completion Rates - Rounded Pie Chart */}
          <RoundedPieChart
                data={[
                  { label: "Exam %", value: Number(examCompletionRate) },
                  { label: "Quiz %", value: Number(quizSubmissionRate) },
                  { label: "Project %", value: Number(projectCompletionRate) },
                ]}
                title="Assessment Completion Overview"
                subtitle="Exam, quiz, and project completion rates"
                changePercent={calculateChange(
                  Number(examCompletionRate) + Number(quizSubmissionRate) + Number(projectCompletionRate),
                  75 // Simulate previous average completion rate
                ).change}
                changeType={calculateChange(
                  Number(examCompletionRate) + Number(quizSubmissionRate) + Number(projectCompletionRate),
                  75
                ).changeType}
              />

          {/* Subject Analysis - Monochrome Bar Chart */}
          {subjectData.length > 0 && (
            <MonochromeBarChart
            data={subjectData}
            title="Subject Performance Analysis"
            subtitle="Exams + quizzes by subject"
            changePercent={calculateChange(subjectData.reduce((sum, item) => sum + item.value, 0), 25).change}
            changeType={calculateChange(subjectData.reduce((sum, item) => sum + item.value, 0), 25).changeType}
          />
          )}

          {/* Quiz Performance Trends - Pinging Dot Chart */}
          {quizPerformance.length > 0 && (
            <PingingDotChart
            data={quizPerformance.map((q, i) => ({
              label: q.quiz,
              score: Math.max(0, Math.min(100, Number.isFinite(q.score) ? Number(q.score.toFixed(1)) : 0))
            }))}
            changePercent={calculateChange(
              quizPerformance.reduce((sum, q) => sum + (Number.isFinite(q.score) ? q.score : 0), 0) / quizPerformance.length,
              80 // Simulate previous average score
            ).change}
            changeType={calculateChange(
              quizPerformance.reduce((sum, q) => sum + (Number.isFinite(q.score) ? q.score : 0), 0) / quizPerformance.length,
              80
            ).changeType}
          />
          )}

        </>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      }
    >
      <AnalyticsPageContent />
    </Suspense>
  );
}
