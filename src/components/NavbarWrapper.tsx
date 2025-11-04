"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const NavbarWrapper: React.FC = () => {
  const pathname = usePathname();
  const [hideComletely, setHideCompletely] = useState(false);
  const [hideOnDesktopOnly, setHideOnDesktopOnly] = useState(false);

  useEffect(() => {
    const isAuthRoute = pathname.startsWith("/login");
    const isDashboardRoot = pathname.startsWith("/dashboard");

    // Hide completely on /auth routes
    setHideCompletely(isAuthRoute);

    // Hide only on desktop for /dashboard
    setHideOnDesktopOnly(isDashboardRoot);
  }, [pathname]);

  // if (loading || hideCompletely) return null;

  return (
    <div className={`${hideOnDesktopOnly ? "md:hidden" : ""} ${hideComletely ? "hidden" : ""}`}>
      <Navbar />
    </div>
  );
};

export default NavbarWrapper;
