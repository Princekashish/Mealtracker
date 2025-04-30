"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

const NavbarWrapper = () => {
  const pathname = usePathname();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // Define routes where Navbar should be hidden
  const hiddenNavbarRoutes = ["/auth"];

  useEffect(() => {
    const shouldHideNavbar = hiddenNavbarRoutes.some((route) =>
      pathname.startsWith(route)
    );
    setIsNavbarVisible(!shouldHideNavbar);
  }, [pathname]);

  return isNavbarVisible ? <Navbar /> : null;
};

export default NavbarWrapper;
