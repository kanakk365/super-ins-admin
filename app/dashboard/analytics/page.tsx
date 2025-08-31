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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient, Institution } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { GlowingStrokeRadarChart } from "@/components/ui/glowing-stroke-radar-chart";
import { MonochromeBarChart } from "@/components/ui/monochrome-bar-chart";
import { PingingDotChart } from "@/components/ui/pinging-dot-chart";
import { RainbowGlowGradientLineChart } from "@/components/ui/rainbow-glow-gradient-line";
import { RoundedPieChart } from "@/components/ui/rounded-pie-chart";
import { ClippedAreaChart } from "@/components/ui/clipped-area-chart";
import { ValueLineBarChart } from "@/components/ui/value-line-bar-chart";
import { IncreaseSizePieChart } from "@/components/ui/increase-size-pie-chart";

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
          (inst) => inst.id === hardcodedInstitutionId
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
        "cmcx8sm3y0000qe0r6xjq6imo"
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
  const calculateChange = (
    current: number,
    previous: number
  ): { change: string; changeType: "increase" | "decrease" } => {
    if (previous === 0) return { change: "+0%", changeType: "increase" };
    const percentChange = ((current - previous) / previous) * 100;
    const sign = percentChange >= 0 ? "+" : "";
    return {
      change: `${sign}${percentChange.toFixed(1)}%`,
      changeType: percentChange >= 0 ? "increase" : "decrease",
    };
  };

  // Main metrics from actual API data
  const mainMetrics = [
    {
      name: "Total Students",
      value: statsData.totals.students.toString(),
      icon: Users,
      ...calculateChange(
        statsData.totals.students,
        Math.max(0, statsData.totals.students - 2)
      ), // Simulate previous period
      description: "Active enrolled students",
    },
    {
      name: "Total Quizzes",
      value: statsData.totals.quizzes.toString(),
      icon: BookOpen,
      ...calculateChange(
        statsData.totals.quizzes,
        Math.max(0, statsData.totals.quizzes - 5)
      ), // Simulate previous period
      description: "Quizzes created this term",
    },
    {
      name: "Total Exams",
      value: statsData.totals.exams.toString(),
      icon: GraduationCap,
      ...calculateChange(
        statsData.totals.exams,
        Math.max(0, statsData.totals.exams - 3)
      ), // Simulate previous period
      description: "Exams scheduled",
    },
    {
      name: "Total Projects",
      value: statsData.totals.projects.toString(),
      icon: Target,
      ...calculateChange(
        statsData.totals.projects,
        Math.max(0, statsData.totals.projects - 1)
      ), // Simulate previous period
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
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
    "UG",
    "PG",
  ];

  // Different dummy data sets for each organization
  const getStudentsPerGradeData = (institutionId: string) => {
    const dataSets = {
      // Organization 1 - Balanced distribution
      "org1": [
        { grade: "1st ", strength: 18 },
        { grade: "2nd ", strength: 22 },
        { grade: "3rd ", strength: 19 },
        { grade: "4th ", strength: 16 },
        { grade: "5th ", strength: 21 },
        { grade: "6th ", strength: 14 },
        { grade: "7th ", strength: 17 },
        { grade: "8th ", strength: 13 },
        { grade: "9th ", strength: 12 },
        { grade: "10th", strength: 11 },
        { grade: "11th ", strength: 9 },
        { grade: "12th", strength: 8 },
        { grade: "UG", strength: 28 },
        { grade: "PG", strength: 6 },
      ],
      // Organization 2 - Higher secondary focus
      "org2": [
        { grade: "1st ", strength: 12 },
        { grade: "2nd ", strength: 15 },
        { grade: "3rd ", strength: 18 },
        { grade: "4th ", strength: 20 },
        { grade: "5th ", strength: 22 },
        { grade: "6th ", strength: 25 },
        { grade: "7th ", strength: 28 },
        { grade: "8th ", strength: 24 },
        { grade: "9th ", strength: 30 },
        { grade: "10th", strength: 35 },
        { grade: "11th ", strength: 32 },
        { grade: "12th", strength: 28 },
        { grade: "UG", strength: 15 },
        { grade: "PG", strength: 8 },
      ],
      // Organization 3 - University focus
      "org3": [
        { grade: "1st ", strength: 8 },
        { grade: "2nd ", strength: 10 },
        { grade: "3rd ", strength: 12 },
        { grade: "4th ", strength: 14 },
        { grade: "5th ", strength: 16 },
        { grade: "6th ", strength: 18 },
        { grade: "7th ", strength: 20 },
        { grade: "8th ", strength: 22 },
        { grade: "9th ", strength: 24 },
        { grade: "10th", strength: 26 },
        { grade: "11th ", strength: 28 },
        { grade: "12th", strength: 30 },
        { grade: "UG", strength: 45 },
        { grade: "PG", strength: 25 },
      ],
    };

    return dataSets[institutionId as keyof typeof dataSets] || dataSets.org1;
  };

  // Map institution IDs to data set keys
  const getDataSetKey = (institutionId: string, institutions: Institution[]) => {
    const index = institutions.findIndex(inst => inst.id === institutionId);
    if (index === 0) return "org1";
    if (index === 1) return "org2";
    if (index === 2) return "org3";
    return "org1"; // Default fallback
  };

  const dataSetKey = getDataSetKey(selectedInstitutionId, institutions);
  const studentsPerGrade = getStudentsPerGradeData(dataSetKey);

  // Exams vs Quizzes by Subject for bar chart (top subjects)
  const mergedBySubject = new Map<
    string,
    { subject: string; exams: number; quizzes: number }
  >();
  statsData.assigned.exams.bySchoolSubject.forEach((e) => {
    mergedBySubject.set(e.subject, {
      subject: e.subject,
      exams: e.count,
      quizzes: 0,
    });
  });
  statsData.assigned.quizzes.bySchoolSubject.forEach((q) => {
    const existing = mergedBySubject.get(q.subject);
    if (existing) existing.quizzes = q.count;
    else
      mergedBySubject.set(q.subject, {
        subject: q.subject,
        exams: 0,
        quizzes: q.count,
      });
  });
  // Different subject data sets for each organization
  const getSubjectData = (institutionId: string) => {
    const dataSets = {
      // Organization 1 - STEM focus
      "org1": [
        { label: "Mathematics", value: 95 },
        { label: "Science", value: 87 },
        { label: "English", value: 82 },
        { label: "History", value: 76 },
        { label: "Physics", value: 91 },
        { label: "Chemistry", value: 85 },
        { label: "Biology", value: 89 },
        { label: "Geography", value: 73 },
        { label: "Computer Science", value: 94 },
        { label: "Literature", value: 78 },
      ],
      // Organization 2 - Humanities focus
      "org2": [
        { label: "Mathematics", value: 88 },
        { label: "Science", value: 84 },
        { label: "English", value: 96 },
        { label: "History", value: 92 },
        { label: "Physics", value: 86 },
        { label: "Chemistry", value: 82 },
        { label: "Biology", value: 89 },
        { label: "Geography", value: 91 },
        { label: "Computer Science", value: 87 },
        { label: "Literature", value: 94 },
      ],
      // Organization 3 - Arts focus
      "org3": [
        { label: "Mathematics", value: 82 },
        { label: "Science", value: 78 },
        { label: "English", value: 98 },
        { label: "History", value: 95 },
        { label: "Physics", value: 79 },
        { label: "Chemistry", value: 81 },
        { label: "Biology", value: 85 },
        { label: "Geography", value: 88 },
        { label: "Computer Science", value: 83 },
        { label: "Literature", value: 97 },
      ],
    };

    return dataSets[institutionId as keyof typeof dataSets] || dataSets.org1;
  };

  const subjectData = getSubjectData(dataSetKey);

  // Different growth data sets for each organization
  const getGrowthData = (institutionId: string) => {
    const dataSets = {
      // Organization 1 - Steady growth pattern
      "org1": [
        { month: "Jan", students: 245 },
        { month: "Feb", students: 112 },
        { month: "Mar", students: 387 },
        { month: "Apr", students: 221 },
        { month: "May", students: 498 },
        { month: "Jun", students: 367 },
        { month: "Jul", students: 623 },
        { month: "Aug", students: 589 },
        { month: "Sep", students: 545 },
        { month: "Oct", students: 812 },
        { month: "Nov", students: 676 },
        { month: "Dec", students: 734 },
      ],
      // Organization 2 - Seasonal growth pattern
      "org2": [
        { month: "Jan", students: 180 },
        { month: "Feb", students: 95 },
        { month: "Mar", students: 420 },
        { month: "Apr", students: 290 },
        { month: "May", students: 550 },
        { month: "Jun", students: 480 },
        { month: "Jul", students: 720 },
        { month: "Aug", students: 680 },
        { month: "Sep", students: 620 },
        { month: "Oct", students: 890 },
        { month: "Nov", students: 750 },
        { month: "Dec", students: 820 },
      ],
      // Organization 3 - Rapid growth pattern
      "org3": [
        { month: "Jan", students: 320 },
        { month: "Feb", students: 145 },
        { month: "Mar", students: 510 },
        { month: "Apr", students: 380 },
        { month: "May", students: 680 },
        { month: "Jun", students: 520 },
        { month: "Jul", students: 850 },
        { month: "Aug", students: 790 },
        { month: "Sep", students: 720 },
        { month: "Oct", students: 1050 },
        { month: "Nov", students: 890 },
        { month: "Dec", students: 980 },
      ],
    };

    return dataSets[institutionId as keyof typeof dataSets] || dataSets.org1;
  };

  const growthData = getGrowthData(dataSetKey);


  return (
    <div className="space-y-8 p-10  ">
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
              <Card
                key={metric.name}
                className="group relative overflow-hidden border border-gray-100/60 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/50"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.name}
                  </CardTitle>
                  <div className="rounded-md p-2 bg-gradient-to-br from-gray-100 to-transparent dark:from-white/10">
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Metrics - Key Performance Indicators */}
          <ValueLineBarChart
                data={(() => {
                  const kpiDataSets = {
                    "org1": [
                      { month: "Students", desktop: 384 },
                      { month: "Teachers", desktop: 156 },
                      { month: "Courses", desktop: 89 },
                      { month: "Exams", desktop: 234 },
                      { month: "Projects", desktop: 670 },
                      { month: "Avg Score", desktop: 824 },
                      { month: "Certifications", desktop: 112 },
                      { month: "Workshops", desktop: 54 },
                      { month: "Clubs", desktop: 380 },
                      { month: "Events", desktop: 120 },
                      { month: "Alumni", desktop: 410 },
                      { month: "Mentors", desktop: 45 },
                    ],
                    "org2": [
                      { month: "Students", desktop: 450 },
                      { month: "Teachers", desktop: 180 },
                      { month: "Courses", desktop: 120 },
                      { month: "Exams", desktop: 290 },
                      { month: "Projects", desktop: 580 },
                      { month: "Avg Score", desktop: 790 },
                      { month: "Certifications", desktop: 145 },
                      { month: "Workshops", desktop: 68 },
                      { month: "Clubs", desktop: 320 },
                      { month: "Events", desktop: 95 },
                      { month: "Alumni", desktop: 380 },
                      { month: "Mentors", desktop: 52 },
                    ],
                    "org3": [
                      { month: "Students", desktop: 520 },
                      { month: "Teachers", desktop: 210 },
                      { month: "Courses", desktop: 145 },
                      { month: "Exams", desktop: 340 },
                      { month: "Projects", desktop: 720 },
                      { month: "Avg Score", desktop: 880 },
                      { month: "Certifications", desktop: 175 },
                      { month: "Workshops", desktop: 82 },
                      { month: "Clubs", desktop: 420 },
                      { month: "Events", desktop: 140 },
                      { month: "Alumni", desktop: 490 },
                      { month: "Mentors", desktop: 68 },
                    ],
                  };
                  return kpiDataSets[dataSetKey as keyof typeof kpiDataSets] || kpiDataSets.org1;
                })()}
                title="Key Performance Indicators"
                subtitle="Maximum values across different educational metrics"
                changeType="increase"
              />

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Students Distribution by Grade - Glowing Stroke Radar Chart */}
            <GlowingStrokeRadarChart data={studentsPerGrade} />

            {/* Student Growth Over Time - Rainbow Glow Gradient Line Chart */}
            <RainbowGlowGradientLineChart
              data={growthData}
              title="Student Growth Trends"
              subtitle="Monthly enrollment growth"
              changeType="increase"
            />

            {/* Student Performance Distribution - Increase Size Pie Chart */}
            <IncreaseSizePieChart />
            
          </div>

          {/* Charts Row - Completion Rates and Subject Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Completion Rates - Rounded Pie Chart */}
            <RoundedPieChart
              data={(() => {
                const completionDataSets = {
                  "org1": [
                    { label: "Exams", value: 85 },
                    { label: "Quizzes", value: 92 },
                    { label: "Projects", value: 78 },
                    { label: "Assignments", value: 88 },
                  ],
                  "org2": [
                    { label: "Exams", value: 90 },
                    { label: "Quizzes", value: 88 },
                    { label: "Projects", value: 82 },
                    { label: "Assignments", value: 91 },
                  ],
                  "org3": [
                    { label: "Exams", value: 87 },
                    { label: "Quizzes", value: 95 },
                    { label: "Projects", value: 85 },
                    { label: "Assignments", value: 89 },
                  ],
                };
                return completionDataSets[dataSetKey as keyof typeof completionDataSets] || completionDataSets.org1;
              })()}
              title="Assessment Completion Overview"
              subtitle="Completion rates across all assessment types"
              changeType="increase"
            />

            {/* Subject Analysis - Monochrome Bar Chart */}
            <MonochromeBarChart
              data={subjectData}
              title="Subject Performance Analysis"
              subtitle="Average scores across all subjects"
              changeType="increase"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 ">
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
