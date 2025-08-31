"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  BarChart3,
  User,
  Menu,
  LogOut,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toaster";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  {
    name: "Institutions",
    href: "/dashboard/institutions",
    icon: Building2,
  },
  {
    name: "Add Institution",
    href: "/dashboard/add-institution",
    icon: Plus,
  },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const profileNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Logout", href: "#", icon: LogOut, action: "logout" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const info = apiClient.getUserInfo();
    setUserInfo(info);
  }, []);

  const handleLogout = () => {
    apiClient.logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };

  const handleNavigation = (item: any) => {
    if (item.action === "logout") {
      handleLogout();
    }
    setOpen(false);
  };

  const ProfileDisplay = () => {
    if (!userInfo) return null;

    const firstLetter = userInfo.firstName.charAt(0).toUpperCase();

    return (
      <Link
        href="/dashboard/profile"
        className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
        onClick={() => setOpen(false)}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
          {firstLetter}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Welcome</p>
          <p className="text-sm font-medium text-foreground truncate">
            {userInfo.firstName} {userInfo.lastName}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
      </Link>
    );
  };

  const NavItems = () => (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-gradient-primary text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>

        {/* Separator line */}
        <li>
          <div className="border-t border-border my-4"></div>
          <ul role="list" className="-mx-2 space-y-1">
            {profileNavigation.map((item) => (
              <li key={item.name}>
                {item.action === "logout" ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation(item)}
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <item.icon className="h-5 w-5 shrink-0 mr-3" />
                    {item.name}
                  </Button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-gradient-primary text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon
                      className="h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>

        {/* Profile Display at bottom */}
        <li className="mt-auto">
          <ProfileDisplay />
        </li>
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Building2 className="h-8 w-8 text-gradient-primary mr-3" />
            <h1 className="text-xl font-bold text-foreground">
              Super Institution Admin
            </h1>
          </div>
          <NavItems />
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="flex items-center gap-x-4 border-b bg-card px-4 py-4 shadow-sm">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <Building2 className="h-8 w-8 text-gradient-primary mr-3" />
                  <h1 className="text-xl font-bold text-foreground">
                    Super Institution Admin
                  </h1>
                </div>
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 text-sm font-semibold leading-6 text-foreground">
            Super Institution Admin
          </div>
        </div>
      </div>
    </>
  );
}
