"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  LineChart,
  Settings,
  Users,
  Utensils,
} from "lucide-react";
import { DesktopSidebar } from "../siderbar";

export function DashboardSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Meals",
      icon: Utensils,
      href: "/dashboard/meals",
      active: pathname === "/dashboard/meals",
    },
    {
      label: "Vendors",
      icon: Users,
      href: "/dashboard/vendors",
      active: pathname === "/dashboard/vendors",
    },
    {
      label: "Analytics",
      icon: LineChart,
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics",
    },
    {
      label: "Setting",
      icon: Settings,
      href: "/dashboard/setting",
      active: pathname === "/dashboard/setting",
    },
  ];

  return (
    <aside className="pt-0">
      <DesktopSidebar routes={routes} />
    </aside>
  );
}
