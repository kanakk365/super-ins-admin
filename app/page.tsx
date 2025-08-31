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
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff } from "lucide-react";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await apiClient.login({
          email: formData.email,
          password: formData.password,
        });

        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.data.admin.firstName} ${response.data.admin.lastName}!`,
        });

        router.push("/dashboard");
      } else {
        const response = await apiClient.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: "SUPER_INSTITUTION_ADMIN",
        });

        toast({
          title: "Registration Successful",
          description: `Welcome ${response.data.admin.firstName} ${response.data.admin.lastName}! Redirecting to dashboard...`,
        });

        // Automatically redirect to dashboard since token is stored
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #006A3D 0%, #2ECC71 50%, #4CAF75 100%)",
      }}
    >
      {/* Isometric Cube Wireframe Pattern Background */}
      <div className="absolute inset-0 w-full h-full">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Green gradient for the wireframe lines */}
            <linearGradient
              id="greenGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#006A3D" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2ECC71" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4CAF75" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient
              id="greenGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#006A3D" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#2ECC71" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#4CAF75" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#006A3D" stopOpacity="1.0" />
              <stop offset="50%" stopColor="#2ECC71" stopOpacity="1.0" />
              <stop offset="100%" stopColor="#4CAF75" stopOpacity="0.9" />
            </linearGradient>
            {/* Glow filter for lines */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Define a single isometric cube wireframe */}
            <g id="isoCube">
              {/* Top face - parallelogram */}
              <path
                d="M 0,0 L 40,-20 L 80,0 L 40,20 Z"
                fill="none"
                stroke="url(#greenGradient1)"
                strokeWidth="1.5"
                filter="url(#glow)"
                opacity="0.8"
              />
              {/* Left face - parallelogram */}
              <path
                d="M 0,0 L 40,20 L 40,60 L 0,40 Z"
                fill="none"
                stroke="url(#greenGradient2)"
                strokeWidth="1.5"
                filter="url(#glow)"
                opacity="0.7"
              />
              {/* Right face - parallelogram */}
              <path
                d="M 40,20 L 80,0 L 80,40 L 40,60 Z"
                fill="none"
                stroke="url(#greenGlow)"
                strokeWidth="1.5"
                filter="url(#glow)"
                opacity="0.6"
              />
            </g>
          </defs>

          {/* Create seamless grid of cubes */}
          <g className="cube-pattern">
            {/* Row 1 */}
            <use href="#isoCube" x="-80" y="-60" />
            <use href="#isoCube" x="0" y="-80" />
            <use href="#isoCube" x="80" y="-60" />
            <use href="#isoCube" x="160" y="-80" />
            <use href="#isoCube" x="240" y="-60" />
            <use href="#isoCube" x="320" y="-80" />
            <use href="#isoCube" x="400" y="-60" />
            <use href="#isoCube" x="480" y="-80" />
            <use href="#isoCube" x="560" y="-60" />
            <use href="#isoCube" x="640" y="-80" />
            <use href="#isoCube" x="720" y="-60" />
            <use href="#isoCube" x="800" y="-80" />
            <use href="#isoCube" x="880" y="-60" />
            <use href="#isoCube" x="960" y="-80" />
            <use href="#isoCube" x="1040" y="-60" />
            <use href="#isoCube" x="1120" y="-80" />
            <use href="#isoCube" x="1200" y="-60" />
            <use href="#isoCube" x="1280" y="-80" />
            <use href="#isoCube" x="1360" y="-60" />
            <use href="#isoCube" x="1440" y="-80" />
            <use href="#isoCube" x="1520" y="-60" />
            <use href="#isoCube" x="1600" y="-80" />
            <use href="#isoCube" x="1680" y="-60" />
            <use href="#isoCube" x="1760" y="-80" />
            <use href="#isoCube" x="1840" y="-60" />
            <use href="#isoCube" x="1920" y="-80" />

            {/* Row 2 */}
            <use href="#isoCube" x="-80" y="0" />
            <use href="#isoCube" x="0" y="-20" />
            <use href="#isoCube" x="80" y="0" />
            <use href="#isoCube" x="160" y="-20" />
            <use href="#isoCube" x="240" y="0" />
            <use href="#isoCube" x="320" y="-20" />
            <use href="#isoCube" x="400" y="0" />
            <use href="#isoCube" x="480" y="-20" />
            <use href="#isoCube" x="560" y="0" />
            <use href="#isoCube" x="640" y="-20" />
            <use href="#isoCube" x="720" y="0" />
            <use href="#isoCube" x="800" y="-20" />
            <use href="#isoCube" x="880" y="0" />
            <use href="#isoCube" x="960" y="-20" />
            <use href="#isoCube" x="1040" y="0" />
            <use href="#isoCube" x="1120" y="-20" />
            <use href="#isoCube" x="1200" y="0" />
            <use href="#isoCube" x="1280" y="-20" />
            <use href="#isoCube" x="1360" y="0" />
            <use href="#isoCube" x="1440" y="-20" />
            <use href="#isoCube" x="1520" y="0" />
            <use href="#isoCube" x="1600" y="-20" />
            <use href="#isoCube" x="1680" y="0" />
            <use href="#isoCube" x="1760" y="-20" />
            <use href="#isoCube" x="1840" y="0" />
            <use href="#isoCube" x="1920" y="-20" />

            {/* Row 3 */}
            <use href="#isoCube" x="-80" y="60" />
            <use href="#isoCube" x="0" y="40" />
            <use href="#isoCube" x="80" y="60" />
            <use href="#isoCube" x="160" y="40" />
            <use href="#isoCube" x="240" y="60" />
            <use href="#isoCube" x="320" y="40" />
            <use href="#isoCube" x="400" y="60" />
            <use href="#isoCube" x="480" y="40" />
            <use href="#isoCube" x="560" y="60" />
            <use href="#isoCube" x="640" y="40" />
            <use href="#isoCube" x="720" y="60" />
            <use href="#isoCube" x="800" y="40" />
            <use href="#isoCube" x="880" y="60" />
            <use href="#isoCube" x="960" y="40" />
            <use href="#isoCube" x="1040" y="60" />
            <use href="#isoCube" x="1120" y="40" />
            <use href="#isoCube" x="1200" y="60" />
            <use href="#isoCube" x="1280" y="40" />
            <use href="#isoCube" x="1360" y="60" />
            <use href="#isoCube" x="1440" y="40" />
            <use href="#isoCube" x="1520" y="60" />
            <use href="#isoCube" x="1600" y="40" />
            <use href="#isoCube" x="1680" y="60" />
            <use href="#isoCube" x="1760" y="40" />
            <use href="#isoCube" x="1840" y="60" />
            <use href="#isoCube" x="1920" y="40" />

            {/* Row 4 */}
            <use href="#isoCube" x="-80" y="120" />
            <use href="#isoCube" x="0" y="100" />
            <use href="#isoCube" x="80" y="120" />
            <use href="#isoCube" x="160" y="100" />
            <use href="#isoCube" x="240" y="120" />
            <use href="#isoCube" x="320" y="100" />
            <use href="#isoCube" x="400" y="120" />
            <use href="#isoCube" x="480" y="100" />
            <use href="#isoCube" x="560" y="120" />
            <use href="#isoCube" x="640" y="100" />
            <use href="#isoCube" x="720" y="120" />
            <use href="#isoCube" x="800" y="100" />
            <use href="#isoCube" x="880" y="120" />
            <use href="#isoCube" x="960" y="100" />
            <use href="#isoCube" x="1040" y="120" />
            <use href="#isoCube" x="1120" y="100" />
            <use href="#isoCube" x="1200" y="120" />
            <use href="#isoCube" x="1280" y="100" />
            <use href="#isoCube" x="1360" y="120" />
            <use href="#isoCube" x="1440" y="100" />
            <use href="#isoCube" x="1520" y="120" />
            <use href="#isoCube" x="1600" y="100" />
            <use href="#isoCube" x="1680" y="120" />
            <use href="#isoCube" x="1760" y="100" />
            <use href="#isoCube" x="1840" y="120" />
            <use href="#isoCube" x="1920" y="100" />

            {/* Row 5 */}
            <use href="#isoCube" x="-80" y="180" />
            <use href="#isoCube" x="0" y="160" />
            <use href="#isoCube" x="80" y="180" />
            <use href="#isoCube" x="160" y="160" />
            <use href="#isoCube" x="240" y="180" />
            <use href="#isoCube" x="320" y="160" />
            <use href="#isoCube" x="400" y="180" />
            <use href="#isoCube" x="480" y="160" />
            <use href="#isoCube" x="560" y="180" />
            <use href="#isoCube" x="640" y="160" />
            <use href="#isoCube" x="720" y="180" />
            <use href="#isoCube" x="800" y="160" />
            <use href="#isoCube" x="880" y="180" />
            <use href="#isoCube" x="960" y="160" />
            <use href="#isoCube" x="1040" y="180" />
            <use href="#isoCube" x="1120" y="160" />
            <use href="#isoCube" x="1200" y="180" />
            <use href="#isoCube" x="1280" y="160" />
            <use href="#isoCube" x="1360" y="180" />
            <use href="#isoCube" x="1440" y="160" />
            <use href="#isoCube" x="1520" y="180" />
            <use href="#isoCube" x="1600" y="160" />
            <use href="#isoCube" x="1680" y="180" />
            <use href="#isoCube" x="1760" y="160" />
            <use href="#isoCube" x="1840" y="180" />
            <use href="#isoCube" x="1920" y="160" />

            {/* Continue more rows to cover full screen */}
            {/* Row 6-20 for complete coverage */}
            <use href="#isoCube" x="-80" y="240" />
            <use href="#isoCube" x="0" y="220" />
            <use href="#isoCube" x="80" y="240" />
            <use href="#isoCube" x="160" y="220" />
            <use href="#isoCube" x="240" y="240" />
            <use href="#isoCube" x="320" y="220" />
            <use href="#isoCube" x="400" y="240" />
            <use href="#isoCube" x="480" y="220" />
            <use href="#isoCube" x="560" y="240" />
            <use href="#isoCube" x="640" y="220" />
            <use href="#isoCube" x="720" y="240" />
            <use href="#isoCube" x="800" y="220" />
            <use href="#isoCube" x="880" y="240" />
            <use href="#isoCube" x="960" y="220" />
            <use href="#isoCube" x="1040" y="240" />
            <use href="#isoCube" x="1120" y="220" />
            <use href="#isoCube" x="1200" y="240" />
            <use href="#isoCube" x="1280" y="220" />
            <use href="#isoCube" x="1360" y="240" />
            <use href="#isoCube" x="1440" y="220" />
            <use href="#isoCube" x="1520" y="240" />
            <use href="#isoCube" x="1600" y="220" />
            <use href="#isoCube" x="1680" y="240" />
            <use href="#isoCube" x="1760" y="220" />
            <use href="#isoCube" x="1840" y="240" />
            <use href="#isoCube" x="1920" y="220" />

            {/* Continue pattern to fully cover viewport */}
            <use href="#isoCube" x="-80" y="300" />
            <use href="#isoCube" x="0" y="280" />
            <use href="#isoCube" x="80" y="300" />
            <use href="#isoCube" x="160" y="280" />
            <use href="#isoCube" x="240" y="300" />
            <use href="#isoCube" x="320" y="280" />
            <use href="#isoCube" x="400" y="300" />
            <use href="#isoCube" x="480" y="280" />
            <use href="#isoCube" x="560" y="300" />
            <use href="#isoCube" x="640" y="280" />
            <use href="#isoCube" x="720" y="300" />
            <use href="#isoCube" x="800" y="280" />
            <use href="#isoCube" x="880" y="300" />
            <use href="#isoCube" x="960" y="280" />
            <use href="#isoCube" x="1040" y="300" />
            <use href="#isoCube" x="1120" y="280" />
            <use href="#isoCube" x="1200" y="300" />
            <use href="#isoCube" x="1280" y="280" />
            <use href="#isoCube" x="1360" y="300" />
            <use href="#isoCube" x="1440" y="280" />
            <use href="#isoCube" x="1520" y="300" />
            <use href="#isoCube" x="1600" y="280" />
            <use href="#isoCube" x="1680" y="300" />
            <use href="#isoCube" x="1760" y="280" />
            <use href="#isoCube" x="1840" y="300" />
            <use href="#isoCube" x="1920" y="280" />

            {/* Final rows for complete coverage */}
            <use href="#isoCube" x="-80" y="360" />
            <use href="#isoCube" x="0" y="340" />
            <use href="#isoCube" x="80" y="360" />
            <use href="#isoCube" x="160" y="340" />
            <use href="#isoCube" x="240" y="360" />
            <use href="#isoCube" x="320" y="340" />
            <use href="#isoCube" x="400" y="360" />
            <use href="#isoCube" x="480" y="340" />
            <use href="#isoCube" x="560" y="360" />
            <use href="#isoCube" x="640" y="340" />
            <use href="#isoCube" x="720" y="360" />
            <use href="#isoCube" x="800" y="340" />
            <use href="#isoCube" x="880" y="360" />
            <use href="#isoCube" x="960" y="340" />
            <use href="#isoCube" x="1040" y="360" />
            <use href="#isoCube" x="1120" y="340" />
            <use href="#isoCube" x="1200" y="360" />
            <use href="#isoCube" x="1280" y="340" />
            <use href="#isoCube" x="1360" y="360" />
            <use href="#isoCube" x="1440" y="340" />
            <use href="#isoCube" x="1520" y="360" />
            <use href="#isoCube" x="1600" y="340" />
            <use href="#isoCube" x="1680" y="360" />
            <use href="#isoCube" x="1760" y="340" />
            <use href="#isoCube" x="1840" y="360" />
            <use href="#isoCube" x="1920" y="340" />

            <use href="#isoCube" x="-80" y="420" />
            <use href="#isoCube" x="0" y="400" />
            <use href="#isoCube" x="80" y="420" />
            <use href="#isoCube" x="160" y="400" />
            <use href="#isoCube" x="240" y="420" />
            <use href="#isoCube" x="320" y="400" />
            <use href="#isoCube" x="400" y="420" />
            <use href="#isoCube" x="480" y="400" />
            <use href="#isoCube" x="560" y="420" />
            <use href="#isoCube" x="640" y="400" />
            <use href="#isoCube" x="720" y="420" />
            <use href="#isoCube" x="800" y="400" />
            <use href="#isoCube" x="880" y="420" />
            <use href="#isoCube" x="960" y="400" />
            <use href="#isoCube" x="1040" y="420" />
            <use href="#isoCube" x="1120" y="400" />
            <use href="#isoCube" x="1200" y="420" />
            <use href="#isoCube" x="1280" y="400" />
            <use href="#isoCube" x="1360" y="420" />
            <use href="#isoCube" x="1440" y="400" />
            <use href="#isoCube" x="1520" y="420" />
            <use href="#isoCube" x="1600" y="400" />
            <use href="#isoCube" x="1680" y="420" />
            <use href="#isoCube" x="1760" y="400" />
            <use href="#isoCube" x="1840" y="420" />
            <use href="#isoCube" x="1920" y="400" />

            <use href="#isoCube" x="-80" y="480" />
            <use href="#isoCube" x="0" y="460" />
            <use href="#isoCube" x="80" y="480" />
            <use href="#isoCube" x="160" y="460" />
            <use href="#isoCube" x="240" y="480" />
            <use href="#isoCube" x="320" y="460" />
            <use href="#isoCube" x="400" y="480" />
            <use href="#isoCube" x="480" y="460" />
            <use href="#isoCube" x="560" y="480" />
            <use href="#isoCube" x="640" y="460" />
            <use href="#isoCube" x="720" y="480" />
            <use href="#isoCube" x="800" y="460" />
            <use href="#isoCube" x="880" y="480" />
            <use href="#isoCube" x="960" y="460" />
            <use href="#isoCube" x="1040" y="480" />
            <use href="#isoCube" x="1120" y="460" />
            <use href="#isoCube" x="1200" y="480" />
            <use href="#isoCube" x="1280" y="460" />
            <use href="#isoCube" x="1360" y="480" />
            <use href="#isoCube" x="1440" y="460" />
            <use href="#isoCube" x="1520" y="480" />
            <use href="#isoCube" x="1600" y="460" />
            <use href="#isoCube" x="1680" y="480" />
            <use href="#isoCube" x="1760" y="460" />
            <use href="#isoCube" x="1840" y="480" />
            <use href="#isoCube" x="1920" y="460" />

            <use href="#isoCube" x="-80" y="540" />
            <use href="#isoCube" x="0" y="520" />
            <use href="#isoCube" x="80" y="540" />
            <use href="#isoCube" x="160" y="520" />
            <use href="#isoCube" x="240" y="540" />
            <use href="#isoCube" x="320" y="520" />
            <use href="#isoCube" x="400" y="540" />
            <use href="#isoCube" x="480" y="520" />
            <use href="#isoCube" x="560" y="540" />
            <use href="#isoCube" x="640" y="520" />
            <use href="#isoCube" x="720" y="540" />
            <use href="#isoCube" x="800" y="520" />
            <use href="#isoCube" x="880" y="540" />
            <use href="#isoCube" x="960" y="520" />
            <use href="#isoCube" x="1040" y="540" />
            <use href="#isoCube" x="1120" y="520" />
            <use href="#isoCube" x="1200" y="540" />
            <use href="#isoCube" x="1280" y="520" />
            <use href="#isoCube" x="1360" y="540" />
            <use href="#isoCube" x="1440" y="520" />
            <use href="#isoCube" x="1520" y="540" />
            <use href="#isoCube" x="1600" y="520" />
            <use href="#isoCube" x="1680" y="540" />
            <use href="#isoCube" x="1760" y="520" />
            <use href="#isoCube" x="1840" y="540" />
            <use href="#isoCube" x="1920" y="520" />

            <use href="#isoCube" x="-80" y="600" />
            <use href="#isoCube" x="0" y="580" />
            <use href="#isoCube" x="80" y="600" />
            <use href="#isoCube" x="160" y="580" />
            <use href="#isoCube" x="240" y="600" />
            <use href="#isoCube" x="320" y="580" />
            <use href="#isoCube" x="400" y="600" />
            <use href="#isoCube" x="480" y="580" />
            <use href="#isoCube" x="560" y="600" />
            <use href="#isoCube" x="640" y="580" />
            <use href="#isoCube" x="720" y="600" />
            <use href="#isoCube" x="800" y="580" />
            <use href="#isoCube" x="880" y="600" />
            <use href="#isoCube" x="960" y="580" />
            <use href="#isoCube" x="1040" y="600" />
            <use href="#isoCube" x="1120" y="580" />
            <use href="#isoCube" x="1200" y="600" />
            <use href="#isoCube" x="1280" y="580" />
            <use href="#isoCube" x="1360" y="600" />
            <use href="#isoCube" x="1440" y="580" />
            <use href="#isoCube" x="1520" y="600" />
            <use href="#isoCube" x="1600" y="580" />
            <use href="#isoCube" x="1680" y="600" />
            <use href="#isoCube" x="1760" y="580" />
            <use href="#isoCube" x="1840" y="600" />
            <use href="#isoCube" x="1920" y="580" />

            <use href="#isoCube" x="-80" y="660" />
            <use href="#isoCube" x="0" y="640" />
            <use href="#isoCube" x="80" y="660" />
            <use href="#isoCube" x="160" y="640" />
            <use href="#isoCube" x="240" y="660" />
            <use href="#isoCube" x="320" y="640" />
            <use href="#isoCube" x="400" y="660" />
            <use href="#isoCube" x="480" y="640" />
            <use href="#isoCube" x="560" y="660" />
            <use href="#isoCube" x="640" y="640" />
            <use href="#isoCube" x="720" y="660" />
            <use href="#isoCube" x="800" y="640" />
            <use href="#isoCube" x="880" y="660" />
            <use href="#isoCube" x="960" y="640" />
            <use href="#isoCube" x="1040" y="660" />
            <use href="#isoCube" x="1120" y="640" />
            <use href="#isoCube" x="1200" y="660" />
            <use href="#isoCube" x="1280" y="640" />
            <use href="#isoCube" x="1360" y="660" />
            <use href="#isoCube" x="1440" y="640" />
            <use href="#isoCube" x="1520" y="660" />
            <use href="#isoCube" x="1600" y="640" />
            <use href="#isoCube" x="1680" y="660" />
            <use href="#isoCube" x="1760" y="640" />
            <use href="#isoCube" x="1840" y="660" />
            <use href="#isoCube" x="1920" y="640" />

            <use href="#isoCube" x="-80" y="720" />
            <use href="#isoCube" x="0" y="700" />
            <use href="#isoCube" x="80" y="720" />
            <use href="#isoCube" x="160" y="700" />
            <use href="#isoCube" x="240" y="720" />
            <use href="#isoCube" x="320" y="700" />
            <use href="#isoCube" x="400" y="720" />
            <use href="#isoCube" x="480" y="700" />
            <use href="#isoCube" x="560" y="720" />
            <use href="#isoCube" x="640" y="700" />
            <use href="#isoCube" x="720" y="720" />
            <use href="#isoCube" x="800" y="700" />
            <use href="#isoCube" x="880" y="720" />
            <use href="#isoCube" x="960" y="700" />
            <use href="#isoCube" x="1040" y="720" />
            <use href="#isoCube" x="1120" y="700" />
            <use href="#isoCube" x="1200" y="720" />
            <use href="#isoCube" x="1280" y="700" />
            <use href="#isoCube" x="1360" y="720" />
            <use href="#isoCube" x="1440" y="700" />
            <use href="#isoCube" x="1520" y="720" />
            <use href="#isoCube" x="1600" y="700" />
            <use href="#isoCube" x="1680" y="720" />
            <use href="#isoCube" x="1760" y="700" />
            <use href="#isoCube" x="1840" y="720" />
            <use href="#isoCube" x="1920" y="700" />

            <use href="#isoCube" x="-80" y="780" />
            <use href="#isoCube" x="0" y="760" />
            <use href="#isoCube" x="80" y="780" />
            <use href="#isoCube" x="160" y="760" />
            <use href="#isoCube" x="240" y="780" />
            <use href="#isoCube" x="320" y="760" />
            <use href="#isoCube" x="400" y="780" />
            <use href="#isoCube" x="480" y="760" />
            <use href="#isoCube" x="560" y="780" />
            <use href="#isoCube" x="640" y="760" />
            <use href="#isoCube" x="720" y="780" />
            <use href="#isoCube" x="800" y="760" />
            <use href="#isoCube" x="880" y="780" />
            <use href="#isoCube" x="960" y="760" />
            <use href="#isoCube" x="1040" y="780" />
            <use href="#isoCube" x="1120" y="760" />
            <use href="#isoCube" x="1200" y="780" />
            <use href="#isoCube" x="1280" y="760" />
            <use href="#isoCube" x="1360" y="780" />
            <use href="#isoCube" x="1440" y="760" />
            <use href="#isoCube" x="1520" y="780" />
            <use href="#isoCube" x="1600" y="760" />
            <use href="#isoCube" x="1680" y="780" />
            <use href="#isoCube" x="1760" y="760" />
            <use href="#isoCube" x="1840" y="780" />
            <use href="#isoCube" x="1920" y="760" />

            <use href="#isoCube" x="-80" y="840" />
            <use href="#isoCube" x="0" y="820" />
            <use href="#isoCube" x="80" y="840" />
            <use href="#isoCube" x="160" y="820" />
            <use href="#isoCube" x="240" y="840" />
            <use href="#isoCube" x="320" y="820" />
            <use href="#isoCube" x="400" y="840" />
            <use href="#isoCube" x="480" y="820" />
            <use href="#isoCube" x="560" y="840" />
            <use href="#isoCube" x="640" y="820" />
            <use href="#isoCube" x="720" y="840" />
            <use href="#isoCube" x="800" y="820" />
            <use href="#isoCube" x="880" y="840" />
            <use href="#isoCube" x="960" y="820" />
            <use href="#isoCube" x="1040" y="840" />
            <use href="#isoCube" x="1120" y="820" />
            <use href="#isoCube" x="1200" y="840" />
            <use href="#isoCube" x="1280" y="820" />
            <use href="#isoCube" x="1360" y="840" />
            <use href="#isoCube" x="1440" y="820" />
            <use href="#isoCube" x="1520" y="840" />
            <use href="#isoCube" x="1600" y="820" />
            <use href="#isoCube" x="1680" y="840" />
            <use href="#isoCube" x="1760" y="820" />
            <use href="#isoCube" x="1840" y="840" />
            <use href="#isoCube" x="1920" y="820" />

            <use href="#isoCube" x="-80" y="900" />
            <use href="#isoCube" x="0" y="880" />
            <use href="#isoCube" x="80" y="900" />
            <use href="#isoCube" x="160" y="880" />
            <use href="#isoCube" x="240" y="900" />
            <use href="#isoCube" x="320" y="880" />
            <use href="#isoCube" x="400" y="900" />
            <use href="#isoCube" x="480" y="880" />
            <use href="#isoCube" x="560" y="900" />
            <use href="#isoCube" x="640" y="880" />
            <use href="#isoCube" x="720" y="900" />
            <use href="#isoCube" x="800" y="880" />
            <use href="#isoCube" x="880" y="900" />
            <use href="#isoCube" x="960" y="880" />
            <use href="#isoCube" x="1040" y="900" />
            <use href="#isoCube" x="1120" y="880" />
            <use href="#isoCube" x="1200" y="900" />
            <use href="#isoCube" x="1280" y="880" />
            <use href="#isoCube" x="1360" y="900" />
            <use href="#isoCube" x="1440" y="880" />
            <use href="#isoCube" x="1520" y="900" />
            <use href="#isoCube" x="1600" y="880" />
            <use href="#isoCube" x="1680" y="900" />
            <use href="#isoCube" x="1760" y="880" />
            <use href="#isoCube" x="1840" y="900" />
            <use href="#isoCube" x="1920" y="880" />

            <use href="#isoCube" x="-80" y="960" />
            <use href="#isoCube" x="0" y="940" />
            <use href="#isoCube" x="80" y="960" />
            <use href="#isoCube" x="160" y="940" />
            <use href="#isoCube" x="240" y="960" />
            <use href="#isoCube" x="320" y="940" />
            <use href="#isoCube" x="400" y="960" />
            <use href="#isoCube" x="480" y="940" />
            <use href="#isoCube" x="560" y="960" />
            <use href="#isoCube" x="640" y="940" />
            <use href="#isoCube" x="720" y="960" />
            <use href="#isoCube" x="800" y="940" />
            <use href="#isoCube" x="880" y="960" />
            <use href="#isoCube" x="960" y="940" />
            <use href="#isoCube" x="1040" y="960" />
            <use href="#isoCube" x="1120" y="940" />
            <use href="#isoCube" x="1200" y="960" />
            <use href="#isoCube" x="1280" y="940" />
            <use href="#isoCube" x="1360" y="960" />
            <use href="#isoCube" x="1440" y="940" />
            <use href="#isoCube" x="1520" y="960" />
            <use href="#isoCube" x="1600" y="940" />
            <use href="#isoCube" x="1680" y="960" />
            <use href="#isoCube" x="1760" y="940" />
            <use href="#isoCube" x="1840" y="960" />
            <use href="#isoCube" x="1920" y="940" />

            <use href="#isoCube" x="-80" y="1020" />
            <use href="#isoCube" x="0" y="1000" />
            <use href="#isoCube" x="80" y="1020" />
            <use href="#isoCube" x="160" y="1000" />
            <use href="#isoCube" x="240" y="1020" />
            <use href="#isoCube" x="320" y="1000" />
            <use href="#isoCube" x="400" y="1020" />
            <use href="#isoCube" x="480" y="1000" />
            <use href="#isoCube" x="560" y="1020" />
            <use href="#isoCube" x="640" y="1000" />
            <use href="#isoCube" x="720" y="1020" />
            <use href="#isoCube" x="800" y="1000" />
            <use href="#isoCube" x="880" y="1020" />
            <use href="#isoCube" x="960" y="1000" />
            <use href="#isoCube" x="1040" y="1020" />
            <use href="#isoCube" x="1120" y="1000" />
            <use href="#isoCube" x="1200" y="1020" />
            <use href="#isoCube" x="1280" y="1000" />
            <use href="#isoCube" x="1360" y="1020" />
            <use href="#isoCube" x="1440" y="1000" />
            <use href="#isoCube" x="1520" y="1020" />
            <use href="#isoCube" x="1600" y="1000" />
            <use href="#isoCube" x="1680" y="1020" />
            <use href="#isoCube" x="1760" y="1000" />
            <use href="#isoCube" x="1840" y="1020" />
            <use href="#isoCube" x="1920" y="1000" />

            <use href="#isoCube" x="-80" y="1080" />
            <use href="#isoCube" x="0" y="1060" />
            <use href="#isoCube" x="80" y="1080" />
            <use href="#isoCube" x="160" y="1060" />
            <use href="#isoCube" x="240" y="1080" />
            <use href="#isoCube" x="320" y="1060" />
            <use href="#isoCube" x="400" y="1080" />
            <use href="#isoCube" x="480" y="1060" />
            <use href="#isoCube" x="560" y="1080" />
            <use href="#isoCube" x="640" y="1060" />
            <use href="#isoCube" x="720" y="1080" />
            <use href="#isoCube" x="800" y="1060" />
            <use href="#isoCube" x="880" y="1080" />
            <use href="#isoCube" x="960" y="1060" />
            <use href="#isoCube" x="1040" y="1080" />
            <use href="#isoCube" x="1120" y="1060" />
            <use href="#isoCube" x="1200" y="1080" />
            <use href="#isoCube" x="1280" y="1060" />
            <use href="#isoCube" x="1360" y="1080" />
            <use href="#isoCube" x="1440" y="1060" />
            <use href="#isoCube" x="1520" y="1080" />
            <use href="#isoCube" x="1600" y="1060" />
            <use href="#isoCube" x="1680" y="1080" />
            <use href="#isoCube" x="1760" y="1060" />
            <use href="#isoCube" x="1840" y="1080" />
            <use href="#isoCube" x="1920" y="1060" />
          </g>
        </svg>
      </div>

      {/* Subtle overlay to ensure content readability */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>

      <div className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-md bg-white/95 border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to your admin account"
                : "Create a new admin account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required={!isLogin}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required={!isLogin}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary text-white hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : isLogin ? "Sign In" : "Register"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                  });
                }}
                className="text-sm text-gradient-primary hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Register here"
                  : "Already have an account? Login here"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
