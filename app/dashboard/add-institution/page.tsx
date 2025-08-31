"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/toaster";
import { apiClient, CreateInstitutionRequest } from "@/lib/api";
import { ArrowLeft, Upload, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddInstitutionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "School",
    affiliatedBoard: "CBSE",
    email: "",
    phone: "",
    website: "",
    yearOfEstablishment: "",
    totalStudentStrength: "",
    address: "",
    primaryColor: "#ffffff",
    secondaryColor: "#ffffff",
    password: "",
  });
  const [proofOfInstitution, setProofOfInstitution] = useState<File | null>(
    null,
  );
  const [logo, setLogo] = useState<File | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "proof" | "logo",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileType === "proof") {
        setProofOfInstitution(file);
      } else {
        setLogo(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proofOfInstitution) {
      toast({
        title: "Error",
        description: "Proof of institution document is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const createData: CreateInstitutionRequest = {
        ...formData,
        totalStudentStrength: parseInt(formData.totalStudentStrength),
        proofOfInstitution,
        ...(logo && { logo }),
      };

      await apiClient.createInstitution(createData);

      toast({
        title: "Success",
        description: "Institution created successfully and is pending approval",
      });

      // Navigate back to institutions page
      router.push("/dashboard/institutions");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create institution",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard/institutions");
  };

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
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Building2 className="h-8 w-8 mr-3 text-gradient-primary" />
          Add New Institution
        </h1>
        <p className="text-muted-foreground">
          Create a new institution in your network
        </p>
      </div>

      {/* Form */}
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Institution Details</CardTitle>
            <CardDescription>
              Fill in all the required information to create a new institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">
                  Basic Information
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Institution Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter institution name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleInputChange}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="School">School</option>
                      <option value="College">College</option>
                      <option value="University">University</option>
                      <option value="Institute">Institute</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="affiliatedBoard">Affiliated Board *</Label>
                    <select
                      id="affiliatedBoard"
                      name="affiliatedBoard"
                      required
                      value={formData.affiliatedBoard}
                      onChange={handleInputChange}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="IB">IB</option>
                      <option value="NIOS">NIOS</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearOfEstablishment">
                      Year of Establishment *
                    </Label>
                    <Input
                      id="yearOfEstablishment"
                      name="yearOfEstablishment"
                      type="number"
                      min="1800"
                      max="2024"
                      required
                      value={formData.yearOfEstablishment}
                      onChange={handleInputChange}
                      placeholder="e.g., 2000"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">
                  Contact Information
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@institution.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://institution.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalStudentStrength">
                      Total Student Strength *
                    </Label>
                    <Input
                      id="totalStudentStrength"
                      name="totalStudentStrength"
                      type="number"
                      min="1"
                      required
                      value={formData.totalStudentStrength}
                      onChange={handleInputChange}
                      placeholder="200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Education Lane, Knowledge City"
                  />
                </div>
              </div>

              {/* Design Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">
                  Design Settings
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        name="primaryColor"
                        type="color"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        className="w-20 h-9"
                      />
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                          }))
                        }
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="color"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        className="w-20 h-9"
                      />
                      <Input
                        value={formData.secondaryColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            secondaryColor: e.target.value,
                          }))
                        }
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Security</h3>
                <div className="space-y-2 max-w-md">
                  <Label htmlFor="password">Institution Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter a secure password"
                  />
                  <p className="text-xs text-muted-foreground">
                    This password will be used for institution login
                  </p>
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Documents</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="proofOfInstitution">
                      Proof of Institution *
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        id="proofOfInstitution"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, "proof")}
                        className="hidden"
                        required
                      />
                      <label
                        htmlFor="proofOfInstitution"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600 mb-1">
                          {proofOfInstitution
                            ? proofOfInstitution.name
                            : "Click to upload proof document"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Supports: PDF, JPG, PNG (Max 10MB)
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Institution Logo (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "logo")}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600 mb-1">
                          {logo ? logo.name : "Click to upload logo"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Supports: JPG, PNG (Max 5MB)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoBack}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-primary text-white hover:opacity-90"
                >
                  {isLoading ? "Creating Institution..." : "Create Institution"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
