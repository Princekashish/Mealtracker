"use client"
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";

import dynamic from "next/dynamic";
import React from "react";
const Section = dynamic(() => import("@/components/section-0"), {
  loading: () => <div className="flex justify-center items-center h-[80vh] ">
    <div className=""><LoaderCircle className="animate-spin" /></div>
  </div>,
})

function HomePage() {
  const { data: session} = authClient.useSession() 
  console.log(session?.user.email);
  
  return (
    <div>
      <Section />
    </div>
  );
}

export default HomePage;