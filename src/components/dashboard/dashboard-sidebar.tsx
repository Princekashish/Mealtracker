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
    // {
    //   label: "Calendar",
    //   icon: Calendar,
    //   href: "/dashboard/calendar",
    //   active: pathname === "/dashboard/calendar",
    // },
    // {
    //   label: "Expenses",
    //   icon: CreditCard,
    //   href: "/dashboard/expenses",
    //   active: pathname === "/dashboard/expenses",
    // },
    {
      label: "Analytics",
      icon: LineChart,
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  return (
    <aside className="pt-0">
      <DesktopSidebar routes={routes} />
    </aside>
  );
}
