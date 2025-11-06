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
    { icon: Home, href: "/dashboard" },
    { icon: Utensils, href: "/dashboard/meals" },
    { icon: Users, href: "/dashboard/vendors" },
    { icon: BarChart2, href: "/dashboard/analytics" },
    { icon: Settings, href: "/dashboard/setting" },
  ];

  if (!pathname.startsWith("/dashboard")) return null;

  return (
    <nav
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        w-[90%] max-w-md
        flex justify-around items-center py-3 px-3
        rounded-full border border-white/20
        bg-white/20 dark:bg-gray-800/20
        backdrop-blur-xl shadow-lg
        md:hidden transition-all duration-300  
      "
    >
      {routes.map((route) => {
        const isActive = pathname === route.href;

        return (
          <Link
            key={route.href}
            href={route.href}
            className={`
              flex flex-col items-center text-[0.7rem] px-4 py-2 group rounded-full transition-all duration-500
              ${isActive
                ? "bg-white/30  backdrop-blur-md shadow-md "
                : "hover:bg-white/10 dark:hover:bg-gray-700/10"
              }
            `}
          >
            <route.icon
              className={` mb-1 transition-colors ${isActive
                ? "text-white linear-gradient(120deg,#3B82F6_0%,#F3A82E_60%) "
                : "text-black/70 dark:text-white/70 group-hover:text-amber-400"
                }`}
            />

          </Link>
        );
      })}
    </nav>
  );
}
