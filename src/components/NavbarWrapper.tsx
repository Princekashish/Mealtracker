"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { useSession } from "next-auth/react";

const NavbarWrapper = () => {
  const pathname = usePathname();
  const { status } = useSession();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // Define routes where Navbar should be hidden
  const hiddenNavbarRoutes = ["/auth"];

  useEffect(() => {
    if (status === "loading") return; 
    const shouldHideNavbar = hiddenNavbarRoutes.some((route) =>
      pathname.startsWith(route)
    );
    setIsNavbarVisible(!shouldHideNavbar);
  }, [pathname]);

  return isNavbarVisible ? <Navbar /> : null;
};

export default NavbarWrapper;
