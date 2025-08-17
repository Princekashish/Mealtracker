"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Utensils,
  Calendar,
  BarChart2,
  Settings,
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
      label: "Calendar",
      icon: Calendar,
      href: "/dashboard/calendar",
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
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-zinc-900 border-t flex justify-around items-center py-2 md:hidden">
      {routes.map((route) => {
        const isActive = pathname === route.href;

        return (
          <Link
            key={route.href}
            href={route.href}
            className="flex flex-col items-center text-xs group"
          >
            <route.icon
              className={`h-6 w-6 mb-1 transition-colors ${
                isActive ? "text-amber-600" : "text-black group-hover:text-amber-500"
              }`}
            />
            <span
              className={`${
                isActive ? "text-amber-600 font-semibold" : "text-black group-hover:text-amber-500"
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
