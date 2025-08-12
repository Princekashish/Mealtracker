"use client"
import dynamic from "next/dynamic";
import React from "react";
const Section = dynamic(() => import("@/components/section-0"), {
  loading: () => <p>Loading...</p>,
})
function HomePage() {


  return (
    <div>
      <Section />
    </div>
  );
}

export default HomePage;