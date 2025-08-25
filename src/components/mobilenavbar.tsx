"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Utensils,
  BarChart2,
  Settings,
  Users,
} from "lucide-react";

export function MobileSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Meal",
      icon: Utensils,
      href: "/dashboard/meals",
    },
    {
      label: "Vendors",
      icon: Users,
      href: "/dashboard/vendors",
    },
    {
      label: "Analysis",
      icon: BarChart2,
      href: "/dashboard/analysis",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  // Only show bottom nav on /dashboard routes
  if (!pathname.startsWith("/dashboard")) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-zinc-900 border-t flex justify-around items-center py-2 md:hidden  p-2">
      {routes.map((route) => {
        const isActive = pathname === route.href;

        return (
          <Link
            key={route.href}
            href={route.href}
            className="flex flex-col items-center text-xs group p-1"
          >
            <route.icon
              className={`h-5 w-5 mb-1 transition-colors ${
                isActive ? "text-amber-600 " : "text-black dark:text-white group-hover:text-amber-500"
              }`}
            />
            <span
              className={`${
                isActive ? "text-amber-600 font-semibold" : "text-black dark:text-white group-hover:text-amber-500"
              }`}
            >
              {route.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
