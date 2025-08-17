"use client"
import { LoaderCircle } from "lucide-react";

import dynamic from "next/dynamic";
import React from "react";
const Section = dynamic(() => import("@/components/section-0"), {
  loading: () => <div className="flex justify-center items-center h-[80vh] ">
    <div className=""><LoaderCircle className="animate-spin" /></div>
  </div>,
})
function HomePage() {


  return (
    <div>
      <Section />
    </div>
  );
}

export default HomePage;