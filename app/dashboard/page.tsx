"use client";

import { useState, useEffect } from "react";
import { Building2, Users, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalInstitutions: number;
  totalStudents: number;
  activeInstitutions: number;
  monthlyGrowth: number;
  totalTeachers: number;
  totalCourses: number;
  totalExams: number;
  totalProjects: number;
  recentEnrollments: number;
  completionRate: number;
  averageScore: number;
  activeUsers: number;
}

const mockStats: DashboardStats = {
  totalInstitutions: 24,
  totalStudents: 3847,
  activeInstitutions: 22,
  monthlyGrowth: 12.3,
  totalTeachers: 156,
  totalCourses: 89,
  totalExams: 234,
  totalProjects: 67,
  recentEnrollments: 89,
  completionRate: 87.5,
  averageScore: 82.4,
  activeUsers: 1247,
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!apiClient.isAuthenticated()) {
        router.push("/");
        return;
      }
    };

    const loadDashboard = async () => {
      try {
        checkAuth();
        // For now, using mock data since we don't have a general stats endpoint
        // In a real implementation, you would fetch from an API
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        setStats(mockStats);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [toast, router]);

  if (isLoading) {
    return (
      <div className="space-y-8 p-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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

        {/* Quick Actions Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-40">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-200 rounded-lg w-12 h-12"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Sections Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-40"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-200 mt-2"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Overview Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-red-600">
            Failed to load dashboard data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Institutions",
      value: stats.totalInstitutions.toString(),
      icon: Building2,
      change: "+3 this month",
      changeType: "increase" as const,
      color: "text-blue-600",
    },
    {
      name: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      change: "+15.2% from last month",
      changeType: "increase" as const,
      color: "text-green-600",
    },
    {
      name: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: TrendingUp,
      change: "+8.7% this week",
      changeType: "increase" as const,
      color: "text-purple-600",
    },
    {
      name: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: BarChart3,
      change: "+2.1% from last month",
      changeType: "increase" as const,
      color: "text-emerald-600",
    },
    {
      name: "Total Teachers",
      value: stats.totalTeachers.toString(),
      icon: Users,
      change: "+5 new teachers",
      changeType: "increase" as const,
      color: "text-indigo-600",
    },
    {
      name: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: Building2,
      change: "+12 this quarter",
      changeType: "increase" as const,
      color: "text-teal-600",
    },
    {
      name: "Average Score",
      value: `${stats.averageScore}%`,
      icon: BarChart3,
      change: "+3.2 points",
      changeType: "increase" as const,
      color: "text-orange-600",
    },
    {
      name: "Recent Enrollments",
      value: stats.recentEnrollments.toString(),
      icon: Users,
      change: "This month",
      changeType: "increase" as const,
      color: "text-pink-600",
    },
  ];

  return (
    <div className="space-y-8 p-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Super Institution Admin dashboard. Here&apos;s an
          overview of your institutions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.name}
            className="group relative overflow-hidden border border-gray-100/60 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/50"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-xl" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <div className="rounded-md p-2 bg-gradient-to-br from-gray-100 to-transparent dark:from-white/10">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <div className="mt-2">
                <span
                  className={
                    stat.changeType === "increase"
                      ? "inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-400"
                      : "inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400"
                  }
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          className="bg-gradient-primary text-white hover:opacity-90 transition-opacity cursor-pointer relative overflow-hidden h-40"
          onClick={() => router.push("/dashboard/institutions")}
        >
          <div className="absolute inset-0 pointer-events-none">
            <svg
              width="339"
              height="162"
              viewBox="0 0 339 162"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full scale-110"
              preserveAspectRatio="xMidYMid slice"
            >
              <mask
                id="mask0_809_8578"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="339"
                height="162"
              >
                <path d="M339 0H0V162H339V0Z" fill="white" />
              </mask>
              <g mask="url(#mask0_809_8578)">
                <g opacity="0.1">
                  <path
                    d="M270.364 53.9535C259.692 32.8967 319.451 -6.06104 319.451 -6.06104H202.862C202.862 -6.06104 191.736 40.2872 110.227 39.597C28.7178 38.9069 -6.78906 73.212 -6.78906 73.212V89.749L3.11652 86.6256C3.11652 86.6256 13.2662 75.4055 30.1823 71.2227C47.0984 67.0431 8.18795 93.4264 0.702836 130.933C-1.12776 140.108 -3.79908 144.887 -6.78906 146.877V172.019H114.166C31.4027 159.198 7.20485 30.3177 167.328 72.8913C327.451 115.465 366.579 90.6205 366.579 90.6205L378.179 24.4274C378.179 24.4274 281.029 75.0102 270.364 53.9535ZM191.96 55.729C166.406 50.6325 196.245 43.9905 213.059 29.3133C229.874 14.6361 237.508 11.7039 250.329 12.3033C293.694 14.325 217.514 60.8223 191.96 55.729Z"
                    fill="white"
                  />
                  <path
                    d="M257.347 97.5864C257.347 97.5864 307.686 103.518 326.946 117.269C346.205 131.021 333.326 153.474 304.4 136.584C289.729 128.018 309.546 119.123 257.347 97.5864Z"
                    fill="white"
                  />
                  <path
                    d="M-13.687 50.266C-13.687 50.266 -7.16601 25.6861 19.1946 14.9571C45.556 4.22819 93.7136 7.75072 61.9446 23.4304C45.8319 31.3823 25.0553 23.0024 -13.687 50.266Z"
                    fill="white"
                  />
                  <path
                    d="M137.55 171.027C137.378 170.968 120.209 165.016 104.009 154.881C89.0315 145.512 71.8205 130.544 74.8783 112.442C77.2119 98.626 89.5454 89.5132 108.717 87.4399C122.018 86.0026 137.338 88.0146 153.022 93.2631C169.707 98.8463 185.918 107.887 199.903 119.407C247.601 158.703 310.734 170.343 377.677 152.18L378.681 153.026C345.833 161.938 313.683 163.799 283.123 158.555C251.231 153.084 222.64 140.076 198.143 119.895C171.335 97.8088 136.41 85.4398 109.165 88.3879C90.9204 90.3607 79.1619 99.1564 76.9048 112.52C73.8992 130.314 90.8635 145.057 105.624 154.29C121.644 164.312 138.568 170.179 138.736 170.237L137.55 171.027Z"
                    fill="white"
                  />
                  <path
                    d="M1.32794 54.2056L-0.411133 53.7014C-0.345367 53.6496 6.32547 48.4465 19.3234 42.815C31.3199 37.6171 51.3359 30.966 78.5596 28.7991C105.765 26.6335 126.083 20.725 134.303 12.5881C140.157 6.79467 139.496 0.255377 132.443 -5.82578L134.222 -6.29688C141.604 0.0677805 142.283 6.92459 136.135 13.0106C127.623 21.4359 106.759 27.5397 78.8938 29.7578C27.7164 33.8318 1.58558 54.0021 1.32794 54.2056Z"
                    fill="white"
                  />
                </g>
              </g>
            </svg>
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">View Institutions</h3>
                <p className="text-white/80">Manage all your institutions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-gradient-primary text-white hover:opacity-90 transition-opacity cursor-pointer relative overflow-hidden h-40"
          onClick={() => router.push("/dashboard/analytics")}
        >
          <div className="absolute inset-0 pointer-events-none">
            <svg
              width="339"
              height="162"
              viewBox="0 0 339 162"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full scale-110"
              preserveAspectRatio="xMidYMid slice"
            >
              <mask
                id="mask1_809_8578"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="339"
                height="162"
              >
                <path d="M339 0H0V162H339V0Z" fill="white" />
              </mask>
              <g mask="url(#mask1_809_8578)">
                <g opacity="0.1">
                  <path
                    d="M270.364 53.9535C259.692 32.8967 319.451 -6.06104 319.451 -6.06104H202.862C202.862 -6.06104 191.736 40.2872 110.227 39.597C28.7178 38.9069 -6.78906 73.212 -6.78906 73.212V89.749L3.11652 86.6256C3.11652 86.6256 13.2662 75.4055 30.1823 71.2227C47.0984 67.0431 8.18795 93.4264 0.702836 130.933C-1.12776 140.108 -3.79908 144.887 -6.78906 146.877V172.019H114.166C31.4027 159.198 7.20485 30.3177 167.328 72.8913C327.451 115.465 366.579 90.6205 366.579 90.6205L378.179 24.4274C378.179 24.4274 281.029 75.0102 270.364 53.9535ZM191.96 55.729C166.406 50.6325 196.245 43.9905 213.059 29.3133C229.874 14.6361 237.508 11.7039 250.329 12.3033C293.694 14.325 217.514 60.8223 191.96 55.729Z"
                    fill="white"
                  />
                  <path
                    d="M257.347 97.5864C257.347 97.5864 307.686 103.518 326.946 117.269C346.205 131.021 333.326 153.474 304.4 136.584C289.729 128.018 309.546 119.123 257.347 97.5864Z"
                    fill="white"
                  />
                  <path
                    d="M-13.687 50.266C-13.687 50.266 -7.16601 25.6861 19.1946 14.9571C45.556 4.22819 93.7136 7.75072 61.9446 23.4304C45.8319 31.3823 25.0553 23.0024 -13.687 50.266Z"
                    fill="white"
                  />
                  <path
                    d="M137.55 171.027C137.378 170.968 120.209 165.016 104.009 154.881C89.0315 145.512 71.8205 130.544 74.8783 112.442C77.2119 98.626 89.5454 89.5132 108.717 87.4399C122.018 86.0026 137.338 88.0146 153.022 93.2631C169.707 98.8463 185.918 107.887 199.903 119.407C247.601 158.703 310.734 170.343 377.677 152.18L378.681 153.026C345.833 161.938 313.683 163.799 283.123 158.555C251.231 153.084 222.64 140.076 198.143 119.895C171.335 97.8088 136.41 85.4398 109.165 88.3879C90.9204 90.3607 79.1619 99.1564 76.9048 112.52C73.8992 130.314 90.8635 145.057 105.624 154.29C121.644 164.312 138.568 170.179 138.736 170.237L137.55 171.027Z"
                    fill="white"
                  />
                  <path
                    d="M1.32794 54.2056L-0.411133 53.7014C-0.345367 53.6496 6.32547 48.4465 19.3234 42.815C31.3199 37.6171 51.3359 30.966 78.5596 28.7991C105.765 26.6335 126.083 20.725 134.303 12.5881C140.157 6.79467 139.496 0.255377 132.443 -5.82578L134.222 -6.29688C141.604 0.0677805 142.283 6.92459 136.135 13.0106C127.623 21.4359 106.759 27.5397 78.8938 29.7578C27.7164 33.8318 1.58558 54.0021 1.32794 54.2056Z"
                    fill="white"
                  />
                </g>
              </g>
            </svg>
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">View Analytics</h3>
                <p className="text-white/80">Analyze performance data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-gradient-primary text-white hover:opacity-90 transition-opacity cursor-pointer relative overflow-hidden h-40"
          onClick={() => router.push("/dashboard/add-institution")}
        >
          <div className="absolute inset-0 pointer-events-none">
            <svg
              width="339"
              height="162"
              viewBox="0 0 339 162"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full scale-110"
              preserveAspectRatio="xMidYMid slice"
            >
              <mask
                id="mask2_809_8578"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="339"
                height="162"
              >
                <path d="M339 0H0V162H339V0Z" fill="white" />
              </mask>
              <g mask="url(#mask2_809_8578)">
                <g opacity="0.1">
                  <path
                    d="M270.364 53.9535C259.692 32.8967 319.451 -6.06104 319.451 -6.06104H202.862C202.862 -6.06104 191.736 40.2872 110.227 39.597C28.7178 38.9069 -6.78906 73.212 -6.78906 73.212V89.749L3.11652 86.6256C3.11652 86.6256 13.2662 75.4055 30.1823 71.2227C47.0984 67.0431 8.18795 93.4264 0.702836 130.933C-1.12776 140.108 -3.79908 144.887 -6.78906 146.877V172.019H114.166C31.4027 159.198 7.20485 30.3177 167.328 72.8913C327.451 115.465 366.579 90.6205 366.579 90.6205L378.179 24.4274C378.179 24.4274 281.029 75.0102 270.364 53.9535ZM191.96 55.729C166.406 50.6325 196.245 43.9905 213.059 29.3133C229.874 14.6361 237.508 11.7039 250.329 12.3033C293.694 14.325 217.514 60.8223 191.96 55.729Z"
                    fill="white"
                  />
                  <path
                    d="M257.347 97.5864C257.347 97.5864 307.686 103.518 326.946 117.269C346.205 131.021 333.326 153.474 304.4 136.584C289.729 128.018 309.546 119.123 257.347 97.5864Z"
                    fill="white"
                  />
                  <path
                    d="M-13.687 50.266C-13.687 50.266 -7.16601 25.6861 19.1946 14.9571C45.556 4.22819 93.7136 7.75072 61.9446 23.4304C45.8319 31.3823 25.0553 23.0024 -13.687 50.266Z"
                    fill="white"
                  />
                  <path
                    d="M137.55 171.027C137.378 170.968 120.209 165.016 104.009 154.881C89.0315 145.512 71.8205 130.544 74.8783 112.442C77.2119 98.626 89.5454 89.5132 108.717 87.4399C122.018 86.0026 137.338 88.0146 153.022 93.2631C169.707 98.8463 185.918 107.887 199.903 119.407C247.601 158.703 310.734 170.343 377.677 152.18L378.681 153.026C345.833 161.938 313.683 163.799 283.123 158.555C251.231 153.084 222.64 140.076 198.143 119.895C171.335 97.8088 136.41 85.4398 109.165 88.3879C90.9204 90.3607 79.1619 99.1564 76.9048 112.52C73.8992 130.314 90.8635 145.057 105.624 154.29C121.644 164.312 138.568 170.179 138.736 170.237L137.55 171.027Z"
                    fill="white"
                  />
                  <path
                    d="M1.32794 54.2056L-0.411133 53.7014C-0.345367 53.6496 6.32547 48.4465 19.3234 42.815C31.3199 37.6171 51.3359 30.966 78.5596 28.7991C105.765 26.6335 126.083 20.725 134.303 12.5881C140.157 6.79467 139.496 0.255377 132.443 -5.82578L134.222 -6.29688C141.604 0.0677805 142.283 6.92459 136.135 13.0106C127.623 21.4359 106.759 27.5397 78.8938 29.7578C27.7164 33.8318 1.58558 54.0021 1.32794 54.2056Z"
                    fill="white"
                  />
                </g>
              </g>
            </svg>
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Add Institution</h3>
                <p className="text-white/80">Create a new institution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-neutral-900/40">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New student enrollment</p>
                <p className="text-xs text-muted-foreground">Sarah Johnson joined Mathematics course</p>
                <p className="text-[11px] text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-neutral-900/40">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Exam completed</p>
                <p className="text-xs text-muted-foreground">Physics final exam by 45 students</p>
                <p className="text-[11px] text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-neutral-900/40">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_0_3px_rgba(168,85,247,0.15)]"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New institution added</p>
                <p className="text-xs text-muted-foreground">Lincoln High School joined the platform</p>
                <p className="text-[11px] text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-neutral-900/40">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_0_3px_rgba(249,115,22,0.15)]"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Course completed</p>
                <p className="text-xs text-muted-foreground">Advanced Chemistry course by 28 students</p>
                <p className="text-[11px] text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-green-600" />
              Top Performing Institutions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-neutral-900/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">SM</div>
                  <div>
                    <p className="text-sm font-medium">Springfield Middle School</p>
                    <p className="text-xs text-muted-foreground">245 students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">94.2%</p>
                  <p className="text-xs text-muted-foreground">completion</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200 dark:bg-neutral-800">
                <div className="h-1.5 rounded-full bg-green-500" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-neutral-900/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm font-bold">RH</div>
                  <div>
                    <p className="text-sm font-medium">Riverside High</p>
                    <p className="text-xs text-muted-foreground">387 students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">91.8%</p>
                  <p className="text-xs text-muted-foreground">completion</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200 dark:bg-neutral-800">
                <div className="h-1.5 rounded-full bg-green-500" style={{ width: '91.8%' }}></div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-neutral-900/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold">WE</div>
                  <div>
                    <p className="text-sm font-medium">Westfield Elementary</p>
                    <p className="text-xs text-muted-foreground">189 students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">89.5%</p>
                  <p className="text-xs text-muted-foreground">completion</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200 dark:bg-neutral-800">
                <div className="h-1.5 rounded-full bg-green-500" style={{ width: '89.5%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
            Performance Overview
          </CardTitle>
          <CardDescription>Monthly performance metrics for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Student Enrollment</span>
                <span className="text-sm text-green-600 font-semibold">+15.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">3,847 students this month</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Course Completion</span>
                <span className="text-sm text-blue-600 font-semibold">+8.7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">87.5% completion rate</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Scores</span>
                <span className="text-sm text-purple-600 font-semibold">+3.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">82.4% average score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
