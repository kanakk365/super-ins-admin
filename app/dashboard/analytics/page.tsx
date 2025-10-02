"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
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
import { ValueLineBarChart } from "@/components/ui/value-line-bar-chart";
import { RoundedPieChart } from "@/components/ui/rounded-pie-chart";
import { ScoreRadar } from "@/components/ui/score-radar";
import { BarGraphSection } from "@/components/ui/barchart";
import { BarGraphSection as BarGraphSectionV2 } from "@/components/ui/barchart2";
// removed unused IncreaseSizePieChart

// removed CustomIncreaseSizePieChart placeholder component

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
  const USE_DUMMY = true;
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] =
    useState<string>("");
  const [selectedInstitutionName, setSelectedInstitutionName] =
    useState<string>("");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [examMode, setExamMode] = useState<"regular" | "customized">("regular");
  const [quizMode, setQuizMode] = useState<"regular" | "customized">("regular");
  const [showMoreContent, setShowMoreContent] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build a complete dummy StatsData for an institution
  const buildDummyStats = (instId: string): StatsData => {
    const ugId = `${instId}-grade-ug`;
    const pgId = `${instId}-grade-pg`;
    const sections = [
      { id: `${ugId}-A`, name: "A", standardId: ugId },
      { id: `${ugId}-B`, name: "B", standardId: ugId },
      { id: `${pgId}-A`, name: "A", standardId: pgId },
    ];

    const examsTotals: Record<string, number> = {
      Math: 120,
      Science: 95,
      "Social studies": 80,
      English: 110,
      UG: 75,
      PG: 60,
    };
    const quizzesTotals: Record<string, number> = {
      Math: 180,
      Science: 160,
      "Social studies": 140,
      English: 170,
      UG: 70,
      PG: 55,
    };
    const projectsUG = 40;
    const projectsPG = 28;

    const toSchoolSubjectArray = (obj: Record<string, number>) =>
      Object.entries(obj)
        .filter(([k]) => !["UG", "PG"].includes(k))
        .map(([subject, count]) => ({ subject, count }));

    const students = Array.from({ length: 60 }).map(
      (_, i) => `stu-${instId}-${i + 1}`
    );
    const pick = (arr: string[], n: number) =>
      arr.slice(0, Math.max(1, Math.min(n, arr.length)));

    return {
      totals: {
        students: 2000,
        quizzes: Object.values(quizzesTotals).reduce((a, b) => a + b, 0),
        quizSubmissions: 1200,
        exams: Object.values(examsTotals).reduce((a, b) => a + b, 0),
        completedExams: 900,
        projects: projectsUG + projectsPG,
        completedProjects: 50,
      },
      breakdown: {
        byClass: [
          { _count: { _all: 30 }, standardId: ugId, standardName: "UG" },
          { _count: { _all: 20 }, standardId: pgId, standardName: "PG" },
        ],
        bySection: sections.map((s) => ({
          _count: { _all: 10 },
          sectionId: s.id,
          sectionName: s.name,
        })),
        gradesWithStrength: [
          { standardId: ugId, grade: "UG", strength: 600 },
          { standardId: pgId, grade: "PG", strength: 400 },
        ],
        sectionsWithStrength: sections.map((s) => ({
          sectionId: s.id,
          section: s.name,
          standardId: s.standardId,
          strength: 200,
        })),
      },
      assigned: {
        exams: {
          bySchoolSubject: toSchoolSubjectArray(examsTotals),
          byClassSubject: [
            {
              standardId: ugId,
              subject: "UG",
              count: examsTotals["UG"],
              standardName: "UG",
            },
            {
              standardId: pgId,
              subject: "PG",
              count: examsTotals["PG"],
              standardName: "PG",
            },
          ],
          bySectionSubject: sections.map((s) => ({
            sectionId: s.id,
            subject: "Math",
            count: 10,
            sectionName: s.name,
          })),
        },
        quizzes: {
          bySchoolSubject: toSchoolSubjectArray(quizzesTotals),
          byClassSubject: [
            {
              standardId: ugId,
              subject: "UG",
              count: quizzesTotals["UG"],
              standardName: "UG",
            },
            {
              standardId: pgId,
              subject: "PG",
              count: quizzesTotals["PG"],
              standardName: "PG",
            },
          ],
          bySectionSubject: sections.map((s) => ({
            sectionId: s.id,
            subject: "Science",
            count: 8,
            sectionName: s.name,
          })),
        },
        projects: {
          byClass: [
            { standardId: ugId, count: projectsUG, standardName: "UG" },
            { standardId: pgId, count: projectsPG, standardName: "PG" },
          ],
          bySection: sections.map((s) => ({
            sectionId: s.id,
            count: 4,
            sectionName: s.name,
          })),
        },
      },
      studentAnalytics: {
        examsLast3: pick(students, 40).map((sid, i) => ({
          studentId: sid,
          standardId: i % 2 === 0 ? ugId : pgId,
          sectionId: sections[i % sections.length].id,
          score: 40 + ((i * 7) % 60),
          examId: `exam-${i}`,
          rn: `${i}`,
          standardName: i % 2 === 0 ? "UG" : "PG",
          sectionName: sections[i % sections.length].name,
        })),
        quizzesLast3: pick(students, 35).map((sid, i) => ({
          studentId: sid,
          standardId: i % 2 === 0 ? ugId : pgId,
          sectionId: sections[i % sections.length].id,
          score: 5 + (i % 20),
          totalQuestions: 20,
          rn: `${i}`,
          standardName: i % 2 === 0 ? "UG" : "PG",
          sectionName: sections[i % sections.length].name,
        })),
        projectsLast3: pick(students, 25).map((sid, i) => ({
          studentId: sid,
          standardId: i % 2 === 0 ? ugId : pgId,
          sectionId: sections[i % sections.length].id,
          isCompleted: i % 3 !== 0,
          rn: `${i}`,
          standardName: i % 2 === 0 ? "UG" : "PG",
          sectionName: sections[i % sections.length].name,
        })),
      },
      classSectionAnalytics: {
        exams: { recentByClass: [], recentBySection: [] },
        quizzes: { recentByClass: [], recentBySection: [] },
      },
      growth: { studentsByMonth: [] },
    };
  };

  useEffect(() => {
    const checkAuth = () => {
      if (!apiClient.isAuthenticated()) {
        if (!USE_DUMMY) {
          router.push("/");
          return false;
        }
      }
      return true;
    };

    const loadInstitutions = async () => {
      try {
        if (!checkAuth()) return;

        setIsLoading(true);
        if (USE_DUMMY) {
          const dummyInstitutions: Institution[] = [
            {
              id: "inst-001",
              name: "Alpha Institute",
              type: "University",
              affiliatedBoard: "UGC",
              email: "alpha@example.com",
              phone: "0000000000",
              website: "alpha.example.com",
              yearOfEstablishment: "1990",
              totalStudentStrength: 1200,
              proofOfInstitutionUrl: "",
              logoUrl: null,
              primaryColor: "#000000",
              secondaryColor: "#ffffff",
              address: "",
              approvalStatus: "APPROVED",
              createdAt: "",
              updatedAt: "",
              addedById: "",
              password: null,
            },
            {
              id: "inst-002",
              name: "Beta College",
              type: "College",
              affiliatedBoard: "AICTE",
              email: "beta@example.com",
              phone: "0000000001",
              website: "beta.example.com",
              yearOfEstablishment: "2001",
              totalStudentStrength: 800,
              proofOfInstitutionUrl: "",
              logoUrl: null,
              primaryColor: "#000000",
              secondaryColor: "#ffffff",
              address: "",
              approvalStatus: "APPROVED",
              createdAt: "",
              updatedAt: "",
              addedById: "",
              password: null,
            },
          ];
          setInstitutions(dummyInstitutions);
          const first = dummyInstitutions[0];
          setSelectedInstitutionId(first.id);
          setSelectedInstitutionName(first.name);
          setStatsData(buildDummyStats(first.id));
        } else {
          const institutionsResponse = await apiClient.getMyInstitutions(
            1,
            100
          );
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
      const statsResponse = await apiClient.getInstitutionStats(institutionId);
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
      setSelectedGradeId("");
      setSelectedSectionId("");
      if (USE_DUMMY) {
        setStatsData(buildDummyStats(institutionId));
      } else {
        await loadStatsForInstitution(institutionId);
      }

      // Update URL without causing page refresh
      const url = new URL(window.location.href);
      url.searchParams.set("institutionId", institutionId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  // ----- Data shaping helpers -----
  type Category =
    | "Math"
    | "Science"
    | "Social studies"
    | "English"
    | "UG"
    | "PG"
    | "Other";

  const subjectToCategory = (subjectRaw: string): Category => {
    const s = (subjectRaw || "").toLowerCase();
    if (s.includes("ug")) return "UG";
    if (s.includes("pg")) return "PG";
    if (
      s.includes("math") ||
      s.includes("algebra") ||
      s.includes("calculus") ||
      s.includes("fraction") ||
      s.includes("linear equation") ||
      s === "f" // fallback seen in payload
    ) {
      return "Math";
    }
    if (
      s.includes("physics") ||
      s.includes("chemistry") ||
      s.includes("biology") ||
      s.includes("photosynthesis") ||
      s.includes("force") ||
      s.includes("motion") ||
      s.includes("science") ||
      s.includes("wave")
    ) {
      return "Science";
    }
    if (s.includes("english") || s.includes("literature")) return "English";
    if (
      s.includes("history") ||
      s.includes("geography") ||
      s.includes("social")
    )
      return "Social studies";
    return "Other";
  };

  const emptyCategoryCounts: Record<Category, number> = {
    Math: 0,
    Science: 0,
    "Social studies": 0,
    English: 0,
    UG: 0,
    PG: 0,
    Other: 0,
  };

  // Convert category totals to pie chart data format
  const toPieData = (totals: Record<Category, number>) =>
    Object.entries(totals)
      .filter(([label]) => label !== "Other")
      .map(([label, value]) => ({ label, value }));

  // Convert full names to shorter versions for bar chart display
  const toBarChartData = (totals: Record<Category, number>) =>
    Object.entries(totals)
      .filter(([label]) => label !== "Other")
      .map(([label, value]) => ({
        label: label === "Social studies" ? "SST" : label,
        value,
      }));

  const aggregateExamsByCategory = (data: StatsData | null) => {
    const totals: Record<Category, number> = { ...emptyCategoryCounts };
    if (!data) return totals;
    // School-wide subjects
    data.assigned.exams.bySchoolSubject.forEach((entry) => {
      const cat = subjectToCategory(entry.subject);
      totals[cat] += entry.count;
    });
    // UG/PG via class subjects
    data.assigned.exams.byClassSubject.forEach((entry) => {
      const std = (entry.standardName || "").toLowerCase();
      if (std === "ug") totals["UG"] += entry.count;
      if (std === "pg") totals["PG"] += entry.count;
    });
    return totals;
  };

  const aggregateQuizzesByCategory = (data: StatsData | null) => {
    const totals: Record<Category, number> = { ...emptyCategoryCounts };
    if (!data) return totals;
    data.assigned.quizzes.bySchoolSubject.forEach((entry) => {
      const cat = subjectToCategory(entry.subject);
      totals[cat] += entry.count;
    });
    data.assigned.quizzes.byClassSubject.forEach((entry) => {
      const std = (entry.standardName || "").toLowerCase();
      if (std === "ug") totals["UG"] += entry.count;
      if (std === "pg") totals["PG"] += entry.count;
    });
    return totals;
  };

  const aggregateProjectsByCategory = (data: StatsData | null) => {
    const totals: Record<Category, number> = { ...emptyCategoryCounts };
    if (!data) return totals;
    data.assigned.projects.byClass.forEach((entry) => {
      const std = (entry.standardName || "").toLowerCase();
      if (std === "ug") totals["UG"] += entry.count;
      if (std === "pg") totals["PG"] += entry.count;
    });
    return totals;
  };

  const examsTotalsByCategory = useMemo(
    () => aggregateExamsByCategory(statsData),
    [statsData]
  );
  const quizzesTotalsByCategory = useMemo(
    () => aggregateQuizzesByCategory(statsData),
    [statsData]
  );
  const projectsTotalsByCategory = useMemo(
    () => aggregateProjectsByCategory(statsData),
    [statsData]
  );

  const quizzesTotalsPieData = useMemo(
    () => toPieData(quizzesTotalsByCategory),
    [quizzesTotalsByCategory]
  );
  const projectsTotalsPieData = useMemo(
    () => toPieData(projectsTotalsByCategory),
    [projectsTotalsByCategory]
  );

  // ----- Dummy Customized Stats -----
  const customizedTotalsByCategory = useMemo(() => {
    // Derive from totals to keep consistent proportions
    const derived: Record<Category, number> = { ...emptyCategoryCounts };
    Object.entries(examsTotalsByCategory).forEach(([k, v]) => {
      derived[k as Category] = Math.floor(v * 0.4);
    });
    return derived;
  }, [examsTotalsByCategory]);

  const customizedQuizzesTotalsByCategory = useMemo(() => {
    const derived: Record<Category, number> = { ...emptyCategoryCounts };
    Object.entries(quizzesTotalsByCategory).forEach(([k, v]) => {
      derived[k as Category] = Math.floor(v * 0.35);
    });
    return derived;
  }, [quizzesTotalsByCategory]);

  const todayDummyCounts = useMemo(() => {
    const base: Record<Category, number> = { ...emptyCategoryCounts };
    // keep small illustrative numbers
    return {
      exams: {
        ...base,
        Math: 5,
        Science: 4,
        "Social studies": 3,
        English: 6,
        UG: 2,
        PG: 1,
      },
      quizzes: {
        ...base,
        Math: 8,
        Science: 7,
        "Social studies": 5,
        English: 9,
        UG: 3,
        PG: 2,
      },
      projects: {
        ...base,
        Math: 1,
        Science: 1,
        "Social studies": 1,
        English: 1,
        UG: 2,
        PG: 1,
      },
      customizedExams: {
        ...base,
        Math: 3,
        Science: 2,
        "Social studies": 2,
        English: 4,
        UG: 1,
        PG: 1,
      },
      customizedQuizzes: {
        ...base,
        Math: 4,
        Science: 3,
        "Social studies": 3,
        English: 5,
        UG: 2,
        PG: 1,
      },
    } as const;
  }, []);

  // Total data (always using totals)
  const totalExamsData = useMemo(
    () => toBarChartData(examsTotalsByCategory),
    [examsTotalsByCategory]
  );

  const totalQuizzesData = useMemo(
    () => toPieData(quizzesTotalsByCategory),
    [quizzesTotalsByCategory]
  );

  const totalProjectsData = useMemo(
    () => projectsTotalsPieData,
    [projectsTotalsByCategory]
  );

  // Today data (always using today dummy counts)
  const todayExamsData = useMemo(
    () => toBarChartData(todayDummyCounts.exams),
    [todayDummyCounts.exams]
  );

  const todayQuizzesData = useMemo(
    () => toPieData(todayDummyCounts.quizzes),
    [todayDummyCounts.quizzes]
  );

  const todayProjectsData = useMemo(
    () => toPieData(todayDummyCounts.projects),
    [todayDummyCounts.projects]
  );

  // Total customized data
  const totalCustomizedExamsData = useMemo(
    () => toPieData(customizedTotalsByCategory),
    [customizedTotalsByCategory]
  );

  const totalCustomizedQuizzesData = useMemo(
    () => toPieData(customizedQuizzesTotalsByCategory),
    [customizedQuizzesTotalsByCategory]
  );

  // Today customized data
  const todayCustomizedExamsData = useMemo(
    () => toPieData(todayDummyCounts.customizedExams),
    [todayDummyCounts.customizedExams]
  );

  const todayCustomizedQuizzesData = useMemo(
    () => toPieData(todayDummyCounts.customizedQuizzes),
    [todayDummyCounts.customizedQuizzes]
  );

  const gradeOptions = useMemo(() => {
    if (!statsData) return [] as { id: string; name: string }[];
    const uniq = new Map<string, string>();
    statsData.breakdown.gradesWithStrength.forEach((g) => {
      uniq.set(g.standardId, g.grade);
    });
    return Array.from(uniq.entries()).map(([id, name]) => ({ id, name }));
  }, [statsData]);

  const sectionOptions = useMemo(() => {
    if (!statsData)
      return [] as { id: string; name: string; standardId?: string }[];
    // If grade selected, try to include only sections that belong to that grade when possible
    const all = statsData.breakdown.sectionsWithStrength.map((s) => ({
      id: s.sectionId,
      name: s.section,
      standardId: s.standardId,
    }));
    const uniq = new Map<
      string,
      { id: string; name: string; standardId?: string }
    >();
    all.forEach((s) => {
      if (!uniq.has(s.id)) uniq.set(s.id, s);
    });
    let list = Array.from(uniq.values());
    if (selectedGradeId)
      list = list.filter((s) => s.standardId === selectedGradeId);
    return list;
  }, [statsData, selectedGradeId]);

  const aggregateBySelection = (type: "exams" | "quizzes") => {
    const totals: Record<Category, number> = { ...emptyCategoryCounts };
    if (!statsData) return totals;
    if (selectedSectionId) {
      const list = statsData.assigned[type].bySectionSubject.filter(
        (x) => x.sectionId === selectedSectionId
      );
      list.forEach((entry) => {
        const cat = subjectToCategory(entry.subject);
        totals[cat] += entry.count;
      });
      // add UG/PG via section's parent grade when determinable
      const sec = statsData.breakdown.sectionsWithStrength.find(
        (s) => s.sectionId === selectedSectionId
      );
      if (sec) {
        const std = statsData.breakdown.gradesWithStrength.find(
          (g) => g.standardId === sec.standardId
        );
        const stdName = (std?.grade || "").toLowerCase();
        if (stdName === "ug")
          totals["UG"] += list.reduce((a, b) => a + b.count, 0);
        if (stdName === "pg")
          totals["PG"] += list.reduce((a, b) => a + b.count, 0);
      }
      return totals;
    }
    if (selectedGradeId) {
      const list = statsData.assigned[type].byClassSubject.filter(
        (x) => x.standardId === selectedGradeId
      );
      list.forEach((entry) => {
        const cat = subjectToCategory(entry.subject);
        totals[cat] += entry.count;
        const std = (entry.standardName || "").toLowerCase();
        if (std === "ug") totals["UG"] += entry.count;
        if (std === "pg") totals["PG"] += entry.count;
      });
      return totals;
    }
    // default school-wide
    return type === "exams" ? examsTotalsByCategory : quizzesTotalsByCategory;
  };

  const selectedExamsByCategory = useMemo(
    () => aggregateBySelection("exams"),
    [statsData, selectedGradeId, selectedSectionId]
  );
  const selectedQuizzesByCategory = useMemo(
    () => aggregateBySelection("quizzes"),
    [statsData, selectedGradeId, selectedSectionId]
  );

  // Projects aggregation by current selection (UG/PG only available)
  const aggregateProjectsBySelection = () => {
    const totals: Record<Category, number> = { ...emptyCategoryCounts };
    if (!statsData) return totals;
    if (selectedSectionId) {
      const list = statsData.assigned.projects.bySection.filter(
        (x) => x.sectionId === selectedSectionId
      );
      const sec = statsData.breakdown.sectionsWithStrength.find(
        (s) => s.sectionId === selectedSectionId
      );
      if (sec) {
        const std = statsData.breakdown.gradesWithStrength.find(
          (g) => g.standardId === sec.standardId
        );
        const stdName = (std?.grade || "").toLowerCase();
        const count = list.reduce((a, b) => a + b.count, 0);
        if (stdName === "ug") totals["UG"] += count;
        if (stdName === "pg") totals["PG"] += count;
      }
      return totals;
    }
    if (selectedGradeId) {
      const list = statsData.assigned.projects.byClass.filter(
        (x) => x.standardId === selectedGradeId
      );
      list.forEach((entry) => {
        const std = (entry.standardName || "").toLowerCase();
        if (std === "ug") totals["UG"] += entry.count;
        if (std === "pg") totals["PG"] += entry.count;
      });
      return totals;
    }
    return projectsTotalsByCategory;
  };

  const selectedProjectsByCategory = useMemo(
    () => aggregateProjectsBySelection(),
    [statsData, selectedGradeId, selectedSectionId, projectsTotalsByCategory]
  );

  // Total selection data
  const totalExamsSelectionPieData = useMemo(
    () => toPieData(selectedExamsByCategory),
    [selectedExamsByCategory]
  );

  const totalQuizzesSelectionPieData = useMemo(
    () => toPieData(selectedQuizzesByCategory),
    [selectedQuizzesByCategory]
  );

  const totalProjectsSelectionPieData = useMemo(
    () => toPieData(selectedProjectsByCategory),
    [selectedProjectsByCategory]
  );

  // Today selection data (using today dummy counts)
  const todayExamsSelectionPieData = useMemo(
    () => toPieData(todayDummyCounts.exams),
    [todayDummyCounts.exams]
  );

  const todayQuizzesSelectionPieData = useMemo(
    () => toPieData(todayDummyCounts.quizzes),
    [todayDummyCounts.quizzes]
  );

  const todayProjectsSelectionPieData = useMemo(
    () => toPieData(todayDummyCounts.projects),
    [todayDummyCounts.projects]
  );

  // Total selection-based customized pies
  const totalSelectedCustomizedExamsPieData = useMemo(() => {
    const base = toPieData(selectedExamsByCategory);
    return base.map((b) => ({
      label: b.label,
      value: Math.floor(b.value * 0.4),
    }));
  }, [selectedExamsByCategory]);

  const totalSelectedCustomizedQuizzesPieData = useMemo(() => {
    const base = toPieData(selectedQuizzesByCategory);
    return base.map((b) => ({
      label: b.label,
      value: Math.floor(b.value * 0.35),
    }));
  }, [selectedQuizzesByCategory]);

  // Today selection-based customized pies
  const todaySelectedCustomizedExamsPieData = useMemo(() => {
    const base = toPieData(todayDummyCounts.customizedExams);
    return base.map((b) => ({
      label: b.label,
      value: Math.floor(b.value * 0.4),
    }));
  }, [todayDummyCounts.customizedExams]);

  const todaySelectedCustomizedQuizzesPieData = useMemo(() => {
    const base = toPieData(todayDummyCounts.customizedQuizzes);
    return base.map((b) => ({
      label: b.label,
      value: Math.floor(b.value * 0.35),
    }));
  }, [todayDummyCounts.customizedQuizzes]);

  // ----- Attempted counts and score distributions (dummy) -----
  const sumValues = (arr: { label: string; value: number }[]) =>
    arr.reduce((acc, it) => acc + it.value, 0);

  // Total attempt counts
  const totalExamsAttempts = useMemo(
    () => Math.floor(sumValues(totalExamsData) * 6),
    [totalExamsData]
  );
  const totalCustomExamsAttempts = useMemo(
    () => Math.floor(sumValues(totalCustomizedExamsData) * 7),
    [totalCustomizedExamsData]
  );
  const totalQuizzesAttempts = useMemo(
    () => Math.floor(sumValues(totalQuizzesData) * 5),
    [totalQuizzesData]
  );
  const totalCustomQuizzesAttempts = useMemo(
    () => Math.floor(sumValues(totalCustomizedQuizzesData) * 6),
    [totalCustomizedQuizzesData]
  );
  const totalProjectsAttempts = useMemo(
    () => Math.floor(sumValues(totalProjectsData) * 8),
    [totalProjectsData]
  );

  // Today attempt counts
  const todayExamsAttempts = useMemo(
    () => Math.floor(sumValues(todayExamsData) * 6),
    [todayExamsData]
  );
  const todayCustomExamsAttempts = useMemo(
    () => Math.floor(sumValues(todayCustomizedExamsData) * 7),
    [todayCustomizedExamsData]
  );
  const todayQuizzesAttempts = useMemo(
    () => Math.floor(sumValues(todayQuizzesData) * 5),
    [todayQuizzesData]
  );
  const todayCustomQuizzesAttempts = useMemo(
    () => Math.floor(sumValues(todayCustomizedQuizzesData) * 6),
    [todayCustomizedQuizzesData]
  );
  const todayProjectsAttempts = useMemo(
    () => Math.floor(sumValues(todayProjectsData) * 8),
    [todayProjectsData]
  );

  const toScoreRadar = (total: number) => [
    { metric: "Low", value: Math.max(0, Math.floor(total * 0.3)) },
    { metric: "Average", value: Math.max(0, Math.floor(total * 0.5)) },
    { metric: "High", value: Math.max(0, Math.floor(total * 0.2)) },
  ];

  // Total score distributions
  const totalExamsScoreData = useMemo(
    () => toScoreRadar(totalExamsAttempts),
    [totalExamsAttempts]
  );
  const totalCustomExamsScoreData = useMemo(
    () => toScoreRadar(totalCustomExamsAttempts),
    [totalCustomExamsAttempts]
  );
  const totalQuizzesScoreData = useMemo(
    () => toScoreRadar(totalQuizzesAttempts),
    [totalQuizzesAttempts]
  );
  const totalCustomQuizzesScoreData = useMemo(
    () => toScoreRadar(totalCustomQuizzesAttempts),
    [totalCustomQuizzesAttempts]
  );
  const totalProjectsScoreData = useMemo(
    () => toScoreRadar(totalProjectsAttempts),
    [totalProjectsAttempts]
  );

  // Today score distributions
  const todayExamsScoreData = useMemo(
    () => toScoreRadar(todayExamsAttempts),
    [todayExamsAttempts]
  );
  const todayCustomExamsScoreData = useMemo(
    () => toScoreRadar(todayCustomExamsAttempts),
    [todayCustomExamsAttempts]
  );
  const todayQuizzesScoreData = useMemo(
    () => toScoreRadar(todayQuizzesAttempts),
    [todayQuizzesAttempts]
  );
  const todayCustomQuizzesScoreData = useMemo(
    () => toScoreRadar(todayCustomQuizzesAttempts),
    [todayCustomQuizzesAttempts]
  );
  const todayProjectsScoreData = useMemo(
    () => toScoreRadar(todayProjectsAttempts),
    [todayProjectsAttempts]
  );

  // Enhanced student data structure
  const detailedStudents = useMemo(() => {
    if (!statsData) return [];

    const subjects = ["Math", "Science", "SST", "English", "UG", "PG"];

    const studentDetails = [
      {
        id: "stu-1",
        name: "Alice Johnson",
        grade: "UG",
        section: "A",
        email: "alice@example.com",
      },
      {
        id: "stu-2",
        name: "Bob Smith",
        grade: "UG",
        section: "B",
        email: "bob@example.com",
      },
      {
        id: "stu-3",
        name: "Charlie Brown",
        grade: "PG",
        section: "A",
        email: "charlie@example.com",
      },
      {
        id: "stu-4",
        name: "Diana Prince",
        grade: "PG",
        section: "B",
        email: "diana@example.com",
      },
      {
        id: "stu-5",
        name: "Edward Norton",
        grade: "UG",
        section: "A",
        email: "edward@example.com",
      },
      {
        id: "stu-6",
        name: "Fiona Green",
        grade: "PG",
        section: "A",
        email: "fiona@example.com",
      },
      {
        id: "stu-7",
        name: "George Lucas",
        grade: "UG",
        section: "B",
        email: "george@example.com",
      },
      {
        id: "stu-8",
        name: "Helen Troy",
        grade: "PG",
        section: "B",
        email: "helen@example.com",
      },
      {
        id: "stu-9",
        name: "Ian Malcolm",
        grade: "UG",
        section: "A",
        email: "ian@example.com",
      },
      {
        id: "stu-10",
        name: "Julia Roberts",
        grade: "PG",
        section: "A",
        email: "julia@example.com",
      },
    ];

    // Filter by grade and section
    let filteredStudents = studentDetails.filter((student) => {
      const matchGrade = selectedGradeId
        ? student.grade.toLowerCase() === selectedGradeId.toLowerCase()
        : true;
      const matchSection = selectedSectionId
        ? student.section === selectedSectionId
        : true;
      return matchGrade && matchSection;
    });

    // Add subject-specific data
    return filteredStudents.map((student) => {
      const scores = subjects.reduce((acc, subject) => {
        acc[subject] = {
          exam: Math.floor(Math.random() * 40) + 60, // 60-100
          quiz: Math.floor(Math.random() * 30) + 70, // 70-100
          project: Math.floor(Math.random() * 20) + 80, // 80-100
          lastActive: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
        };
        return acc;
      }, {} as Record<string, { exam: number; quiz: number; project: number; lastActive: string }>);

      return {
        ...student,
        scores,
        totalScore: Math.floor(Math.random() * 20) + 80, // Overall score
        attendance: Math.floor(Math.random() * 20) + 80, // 80-100%
        status: Math.random() > 0.1 ? "Active" : "Inactive",
      };
    });
  }, [statsData, selectedGradeId, selectedSectionId, selectedSubject]);

  const studentsForSelection = useMemo(() => {
    if (!statsData) return [] as string[];
    const ids = new Set<string>();
    const pushIfMatch = (
      standardId: string,
      sectionId: string,
      studentId: string
    ) => {
      const matchSection = selectedSectionId
        ? sectionId === selectedSectionId
        : true;
      const matchGrade = selectedGradeId
        ? standardId === selectedGradeId
        : true;
      if (matchSection && matchGrade) ids.add(studentId);
    };
    statsData.studentAnalytics.examsLast3.forEach((x) =>
      pushIfMatch(x.standardId, x.sectionId, x.studentId)
    );
    statsData.studentAnalytics.quizzesLast3.forEach((x) =>
      pushIfMatch(x.standardId, x.sectionId, x.studentId)
    );
    statsData.studentAnalytics.projectsLast3.forEach((x) =>
      pushIfMatch(x.standardId, x.sectionId, x.studentId)
    );
    return Array.from(ids);
  }, [statsData, selectedGradeId, selectedSectionId]);

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
  return (
    <div className="space-y-8 p-10  ">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Super Institution Admin analytics
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

      {/* Main Analytics Charts */}
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
            <Card className="group relative overflow-hidden border border-gray-100/60 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/50">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <div className="rounded-md p-2 bg-gradient-to-br from-gray-100 to-transparent dark:from-white/10">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {statsData.totals.students}
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-400">
                    +12% from last month
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border border-gray-100/60 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/50">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-green-500/10 to-transparent blur-xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Grades
                </CardTitle>
                <div className="rounded-md p-2 bg-gradient-to-br from-gray-100 to-transparent dark:from-white/10">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {gradeOptions.length}
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-400">
                    +2 new this month
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border border-gray-100/60 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/50">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sections
                </CardTitle>
                <div className="rounded-md p-2 bg-gradient-to-br from-gray-100 to-transparent dark:from-white/10">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {sectionOptions.length}
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-400">
                    +8 new this month
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border border-gray-100/60 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/50">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-orange-500/10 to-transparent blur-xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Teachers
                </CardTitle>
                <div className="rounded-md p-2 bg-gradient-to-br from-gray-100 to-transparent dark:from-white/10">
                  <Award className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {USE_DUMMY ? 85 : 0}
                </div>
                {!USE_DUMMY && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Placeholder
                  </p>
                )}
                {USE_DUMMY && (
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-400">
                      +5 new teachers
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* BARCHART SECTION - Version 1 (with Summary Statistics) */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-blue-600">Chart Version 1: With Summary Statistics</h3>
              <p className="text-sm text-muted-foreground">This version includes a legend and summary statistics below the chart</p>
            </div>
            <BarGraphSection
              institutions={institutions}
              grades={gradeOptions.map(g => ({ id: g.id, name: g.name }))}
              sections={sectionOptions.map(s => ({ id: s.id, name: s.name }))}
              onFilterChange={(filters) => {
                console.log('Bar graph V1 filters changed:', filters);
                // You can use these filters to update other parts of the analytics
              }}
            />
          </div>

          {/* BARCHART SECTION - Version 2 (with Legend) */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-green-600">Chart Version 2: With Legend</h3>
              <p className="text-sm text-muted-foreground">This version includes an integrated legend in the chart area</p>
            </div>
            <BarGraphSectionV2
              institutions={institutions}
              grades={gradeOptions.map(g => ({ id: g.id, name: g.name }))}
              sections={sectionOptions.map(s => ({ id: s.id, name: s.name }))}
              onFilterChange={(filters) => {
                console.log('Bar graph V2 filters changed:', filters);
                // You can use these filters to update other parts of the analytics
              }}
            />
          </div>

          {/* LOAD MORE BUTTON */}
          {!showMoreContent && (
            <div className="flex justify-center py-8">
              <Button
                onClick={() => setShowMoreContent(true)}
                className="px-8 py-3 text-lg font-medium bg-primary hover:bg-primary/90"
              >
                Load More Analytics
              </Button>
            </div>
          )}

          {/* REMAINING CONTENT */}
          {showMoreContent && (
            <>
              {/* TOTAL STATS CHARTS */}
              <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Total Statistics
            </h2>
            {/* Total Subject Charts - Pie Charts */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <RoundedPieChart
                data={totalExamsData}
                title="Total Exams - by Subject"
                subtitle="Math, Science, Social studies, English, UG, PG"
              />
              <RoundedPieChart
                data={totalQuizzesData}
                title="Total Quizzes - by Subject"
                subtitle="Math, Science, Social studies, English, UG, PG"
              />
              <RoundedPieChart
                data={totalProjectsData}
                title="Total Projects - by Subject"
                subtitle="UG/PG available; subjects pending"
              />
            </div>

            {/* Total Customized Exams/Quizzes */}
            <div className="grid gap-6 md:grid-cols-2">
              <RoundedPieChart
                data={totalCustomizedExamsData}
                title="Total Customized Exams - by Subject"
                subtitle="Math, Science, Social studies, English, UG, PG"
              />
              <RoundedPieChart
                data={totalCustomizedQuizzesData}
                title="Total Customized Quizzes - by Subject"
                subtitle="Math, Science, Social studies, English, UG, PG"
              />
            </div>
          </div>

          {/* TODAY STATS CHARTS */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Today Statistics
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <RoundedPieChart
                data={todayExamsData}
                title="Today Exams - by Subject"
                subtitle="Math, Science, Social studies, English, UG, PG"
              />
              <RoundedPieChart
                data={todayQuizzesData}
                title="Today Quizzes - by Subject"
                subtitle="Math, Science, Social studies, English, UG, PG"
              />
              <RoundedPieChart
                data={todayProjectsData}
                title="Today Projects - by Subject"
                subtitle="UG/PG available; subjects pending"
              />
            </div>

            {/* Today Customized Exams/Quizzes */}
            <div className="grid gap-6 md:grid-cols-2">
              <RoundedPieChart
                data={todayCustomizedExamsData}
                title="Today Customized Exams - by Subject"
                subtitle="Math, Science, Social studies, English, UG, PG"
              />
              <RoundedPieChart
                data={todayCustomizedQuizzesData}
                title="Today Customized Quizzes - by Subject"
                subtitle="Math, Science, Social studies, English, UG, PG"
              />
            </div>
          </div>

          {/* Grade Vise & Section Vise Stats */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Grade & Section Wise Statistics
              </h2>
            </div>

            {/* Grade and Section Selectors */}
            <div className="grid gap-4 md:grid-cols-2 max-w-md">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Grade</label>
                <select
                  value={selectedGradeId}
                  onChange={(e) => setSelectedGradeId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">All Grades</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Select Section</label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">All Sections</option>
                  {sectionOptions
                    .filter((section) =>
                      !selectedGradeId || section.standardId === selectedGradeId
                    )
                    .map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name} ({section.standardId?.includes('ug') ? 'UG' : 'PG'})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Exam Section with Toggle */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">Exams</h3>
                <div className="flex bg-muted rounded-md p-1">
                  <button
                    onClick={() => setExamMode("regular")}
                    className={`px-3 py-1 rounded-sm text-sm font-medium transition-colors ${
                      examMode === "regular"
                        ? "bg-white text-black shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Regular Exams
                  </button>
                  <button
                    onClick={() => setExamMode("customized")}
                    className={`px-3 py-1 rounded-sm text-sm font-medium transition-colors ${
                      examMode === "customized"
                        ? "bg-white text-black shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Customized Exams
                  </button>
                </div>
              </div>

              {/* Exam Score Distribution Charts */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {["Math", "Science", "SST", "English", "UG", "PG"].map((subject) => (
                  <Card key={subject} className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {subject} - {examMode === "regular" ? "Regular" : "Customized"}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Students attempted: {Math.floor(Math.random() * 50) + 20}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RoundedPieChart
                        data={[
                          { label: "Low (0-50)", value: Math.floor(Math.random() * 20) + 5 },
                          { label: "Average (51-80)", value: Math.floor(Math.random() * 25) + 10 },
                          { label: "High (81-100)", value: Math.floor(Math.random() * 15) + 5 },
                        ]}
                        title=""
                        subtitle=""
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quiz Section with Toggle */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">Quizzes</h3>
                <div className="flex bg-muted rounded-md p-1">
                  <button
                    onClick={() => setQuizMode("regular")}
                    className={`px-3 py-1 rounded-sm text-sm font-medium transition-colors ${
                      quizMode === "regular"
                        ? "bg-white text-black shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Regular Quizzes
                  </button>
                  <button
                    onClick={() => setQuizMode("customized")}
                    className={`px-3 py-1 rounded-sm text-sm font-medium transition-colors ${
                      quizMode === "customized"
                        ? "bg-white text-black shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Customized Quizzes
                  </button>
                </div>
              </div>

              {/* Quiz Score Distribution Charts */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {["Math", "Science", "SST", "English", "UG", "PG"].map((subject) => (
                  <Card key={subject} className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {subject} - {quizMode === "regular" ? "Regular" : "Customized"}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Students attempted: {Math.floor(Math.random() * 40) + 15}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RoundedPieChart
                        data={[
                          { label: "Low (0-50)", value: Math.floor(Math.random() * 15) + 3 },
                          { label: "Average (51-80)", value: Math.floor(Math.random() * 20) + 8 },
                          { label: "High (81-100)", value: Math.floor(Math.random() * 12) + 3 },
                        ]}
                        title=""
                        subtitle=""
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Projects</h3>

              {/* Project Score Distribution Charts */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {["Math", "Science", "SST", "English", "UG", "PG"].map((subject) => (
                  <Card key={subject} className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {subject} - Projects
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Students attempted: {Math.floor(Math.random() * 30) + 10}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RoundedPieChart
                        data={[
                          { label: "Low (0-50)", value: Math.floor(Math.random() * 8) + 2 },
                          { label: "Average (51-80)", value: Math.floor(Math.random() * 15) + 5 },
                          { label: "High (81-100)", value: Math.floor(Math.random() * 10) + 2 },
                        ]}
                        title=""
                        subtitle=""
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Students list with subject filtering */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Students
                </h2>
                <p className="text-muted-foreground text-sm">
                  Showing students with recent activity{" "}
                  {selectedGradeId ? "in selected grade" : "across all grades"}
                  {selectedSectionId ? " and section" : ""}.
                </p>
              </div>

              {/* Subject Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter by Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">All Subjects</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="Social studies">Social studies</option>
                  <option value="English">English</option>
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                </select>
              </div>
            </div>

            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Total Students: {detailedStudents.length}
                  {selectedSubject && ` | Filtered by: ${selectedSubject}`}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b">
                        <th className="py-3 pr-4 font-medium">Name</th>
                        <th className="py-3 pr-4 font-medium">Grade</th>
                        <th className="py-3 pr-4 font-medium">Section</th>
                        <th className="py-3 pr-4 font-medium">Email</th>
                        {selectedSubject && (
                          <>
                            <th className="py-3 pr-4 font-medium">
                              Exam Score
                            </th>
                            <th className="py-3 pr-4 font-medium">
                              Quiz Score
                            </th>
                            <th className="py-3 pr-4 font-medium">
                              Project Score
                            </th>
                          </>
                        )}
                        <th className="py-3 pr-4 font-medium">Total Score</th>
                        <th className="py-3 pr-4 font-medium">Attendance</th>
                        <th className="py-3 pr-4 font-medium">Status</th>
                        <th className="py-3 pr-4 font-medium">Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedStudents.length > 0 ? (
                        detailedStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="border-b last:border-b-0 hover:bg-muted/50"
                          >
                            <td className="py-3 pr-4">
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {student.id}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  student.grade === "UG"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {student.grade}
                              </span>
                            </td>
                            <td className="py-3 pr-4 font-medium">
                              {student.section}
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground">
                              {student.email}
                            </td>
                            {selectedSubject && (
                              <>
                                <td className="py-3 pr-4">
                                  <span
                                    className={`font-medium ${
                                      student.scores[selectedSubject]?.exam >=
                                      90
                                        ? "text-green-600"
                                        : student.scores[selectedSubject]
                                            ?.exam >= 75
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {student.scores[selectedSubject]?.exam}%
                                  </span>
                                </td>
                                <td className="py-3 pr-4">
                                  <span
                                    className={`font-medium ${
                                      student.scores[selectedSubject]?.quiz >=
                                      90
                                        ? "text-green-600"
                                        : student.scores[selectedSubject]
                                            ?.quiz >= 75
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {student.scores[selectedSubject]?.quiz}%
                                  </span>
                                </td>
                                <td className="py-3 pr-4">
                                  <span
                                    className={`font-medium ${
                                      student.scores[selectedSubject]
                                        ?.project >= 90
                                        ? "text-green-600"
                                        : student.scores[selectedSubject]
                                            ?.project >= 75
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {student.scores[selectedSubject]?.project}%
                                  </span>
                                </td>
                              </>
                            )}
                            <td className="py-3 pr-4">
                              <span
                                className={`font-medium ${
                                  student.totalScore >= 90
                                    ? "text-green-600"
                                    : student.totalScore >= 75
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {student.totalScore}%
                              </span>
                            </td>
                            <td className="py-3 pr-4">{student.attendance}%</td>
                            <td className="py-3 pr-4">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  student.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {student.status}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground">
                              {selectedSubject
                                ? student.scores[selectedSubject]?.lastActive
                                : "Various"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={selectedSubject ? 11 : 8}
                            className="py-8 text-center text-muted-foreground"
                          >
                            No students found for the current selection.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
              </>
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
