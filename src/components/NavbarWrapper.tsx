"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/utils/Auth/AuthProvider";

const NavbarWrapper: React.FC = () => {
  const pathname = usePathname();
  const { loading } = useAuth();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // Define routes where Navbar should be hidden
  const hiddenNavbarRoutes = ["/auth", "/dashboard"];

  useEffect(() => {
    // Hide navbar during loading state or on auth routes
    const shouldHideNavbar = hiddenNavbarRoutes.some((route) => pathname.startsWith(route));

    setIsNavbarVisible(!shouldHideNavbar);
  }, [pathname, loading]);

  return isNavbarVisible ? <Navbar /> : null;
};

export default NavbarWrapper;
