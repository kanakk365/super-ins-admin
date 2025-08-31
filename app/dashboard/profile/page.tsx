"use client";

import { useState, useEffect } from "react";
import { User, Mail, Calendar, Shield, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}

const mockProfile: UserProfile = {
  id: "cmev688pa0000qeic4900a395",
  firstName: "steph",
  lastName: "super admin",
  email: "stephsuperadmin@example.com",
  role: "SUPER_INSTITUTION_ADMIN",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-12-20T14:45:00Z",
  isActive: true,
  isDeleted: false,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!apiClient.isAuthenticated()) {
        router.push("/");
        return false;
      }
      return true;
    };

    const loadProfile = async () => {
      try {
        if (!checkAuth()) return;

        setIsLoading(true);
        // For now, using mock data since we don't have a profile endpoint
        // In a real implementation, you would fetch from an API
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        setProfile(mockProfile);
        setEditedProfile(mockProfile);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [toast, router]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedProfile(profile || {});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile(profile || {});
  };

  const handleSaveProfile = async () => {
    try {
      // In a real implementation, you would call an API to update the profile
      // await apiClient.updateProfile(editedProfile);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProfile(editedProfile as UserProfile);
      setIsEditing(false);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center py-20">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <div className="h-10 bg-green-200 rounded-lg w-64 mx-auto animate-pulse"></div>
              <div className="h-4 bg-emerald-200 rounded w-80 mx-auto animate-pulse"></div>
            </div>
          </div>

          {/* Profile Card Skeleton */}
          <div className="w-full max-w-2xl">
            <div className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-lg p-6">
              {/* Header Skeleton */}
              <div className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-green-200 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-6 bg-green-200 rounded w-48 animate-pulse"></div>
                      <div className="h-4 bg-emerald-200 rounded w-40 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-green-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>

              {/* Form Content Skeleton */}
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-4 bg-green-200 rounded w-20 animate-pulse"></div>
                      <div className="h-10 bg-emerald-100 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <div className="h-4 bg-green-200 rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-emerald-100 rounded animate-pulse"></div>
                </div>

                {/* Role and Member Since Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-4 bg-green-200 rounded w-16 animate-pulse"></div>
                      <div className="h-12 bg-emerald-100 rounded-lg animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center py-20">
        <div className="w-full max-w-2xl space-y-8">
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-900 to-emerald-600 bg-clip-text text-transparent">
                Profile Error
              </h1>
              <p className="text-slate-600 mt-2">
                Failed to load profile data. Please try again.
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100  flex justify-center items-center py-20">
      <div className=" max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center text-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-900 to-emerald-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-slate-600 mt-2">
                Manage your account information and preferences
              </p>
            </div>
            
          </div>
        </div>

        <div className="flex justify-center">
          {/* Profile Information */}
          <div className="w-full max-w-2xl">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900">Profile Information</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">Update your personal details</p>
                    </div>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditProfile}
                      className="border-green-200 hover:bg-green-50 hover:border-green-300 text-green-700"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="border-green-200 hover:bg-green-50 text-green-700"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                      First Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedProfile.firstName || ""}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="Enter your first name"
                        className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-slate-900 font-medium">{profile.firstName}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                      Last Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedProfile.lastName || ""}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Enter your last name"
                        className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-slate-900 font-medium">{profile.lastName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-900 font-medium">{profile.email}</span>
                    </div>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Role</Label>
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium">
                        {profile.role.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Member Since</Label>
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-900 font-medium">
                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
