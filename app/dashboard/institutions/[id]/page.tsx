"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Users,
  BookOpen,
  DollarSign,
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient, InstitutionStatsResponse } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";

interface InstitutionDetails {
  id: string;
  name: string;
  type: string;
  affiliatedBoard: string;
  email: string;
  phone: string;
  website: string;
  yearOfEstablishment: string;
  totalStudentStrength: number;
  address: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
}

const mockInstitutionDetails: InstitutionDetails = {
  id: "cmewmtmcs0000qes5rmx1j6x3",
  name: "Greenwood High new update",
  type: "School",
  affiliatedBoard: "CBSE",
  email: "contactupdate1@greenwood.edu",
  phone: "1230167890",
  website: "https://gh.com",
  yearOfEstablishment: "2000",
  totalStudentStrength: 200,
  address: "123 Education Lane, Knowledge City",
  approvalStatus: "APPROVED",
  createdAt: "2025-08-29T09:30:13.996Z",
  updatedAt: "2025-08-29T09:30:34.328Z",
};

const mockStats = {
  totals: {
    students: 5,
    quizzes: 29,
    quizSubmissions: 16,
    exams: 20,
    completedExams: 12,
    projects: 7,
    completedProjects: 0,
  },
};

export default function InstitutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const institutionId = params.id as string;

  const [institution, setInstitution] = useState<InstitutionDetails | null>(
    null,
  );
  const [stats, setStats] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      if (!apiClient.isAuthenticated()) {
        router.push("/");
        return false;
      }
      return true;
    };

    const loadInstitutionDetails = async () => {
      try {
        if (!checkAuth()) return;

        setIsLoading(true);

        // For now, using mock data since we don't have a specific institution details endpoint
        // In a real implementation, you would fetch institution details from an API
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        setInstitution(mockInstitutionDetails);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load institution details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const loadInstitutionStats = async () => {
      try {
        if (!checkAuth()) return;

        setStatsLoading(true);

        // Try to load real stats from API
        const statsData = await apiClient.getInstitutionStats(institutionId);
        setStats(statsData.data);
      } catch (error) {
        console.warn("Failed to load real stats, using mock data:", error);
        // Fallback to mock data if API fails
        await new Promise((resolve) => setTimeout(resolve, 500));
        setStats(mockStats);
      } finally {
        setStatsLoading(false);
      }
    };

    loadInstitutionDetails();
    loadInstitutionStats();
  }, [institutionId, toast, router]);

  const handleGoBack = () => {
    router.push("/dashboard/institutions");
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Institutions
          </Button>
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Institutions
          </Button>
        </div>
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Institution not found</h3>
          <p className="text-muted-foreground">
            The institution you're looking for doesn't exist or you don't have
            access to it.
          </p>
        </div>
      </div>
    );
  }

  const statCards = stats
    ? [
        {
          name: "Total Students",
          value: stats.totals.students.toLocaleString(),
          icon: Users,
          change: "+12.5%",
          changeType: "increase" as const,
        },
        {
          name: "Total Quizzes",
          value: stats.totals.quizzes.toString(),
          icon: BookOpen,
          change: "+3 this month",
          changeType: "increase" as const,
        },
        {
          name: "Total Exams",
          value: stats.totals.exams.toLocaleString(),
          icon: TrendingUp,
          change: `${stats.totals.completedExams} completed`,
          changeType: "increase" as const,
        },
        {
          name: "Total Projects",
          value: stats.totals.projects.toString(),
          icon: DollarSign,
          change: `${stats.totals.completedProjects} completed`,
          changeType: "increase" as const,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Institutions
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {institution.name}
          </h1>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              institution.approvalStatus === "APPROVED"
                ? "bg-green-100 text-green-800"
                : institution.approvalStatus === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {institution.approvalStatus}
          </span>
        </div>
        <p className="text-muted-foreground">
          Institution details and analytics
        </p>
      </div>

      {/* Institution Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Institution Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {institution.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {institution.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(institution.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(institution.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm text-muted-foreground">
                      {institution.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Affiliated Board</p>
                    <p className="text-sm text-muted-foreground">
                      {institution.affiliatedBoard}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {institution.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View Students
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                View Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Grid */}
      {statsLoading ? (
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
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Stats unavailable</h3>
            <p className="text-muted-foreground">
              Unable to load statistics for this institution.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
