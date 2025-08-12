
import { LoaderCircle } from "lucide-react";
import React, { Suspense } from "react";
const Section = React.lazy(() => import("@/components/section-0"))
function HomePage() {


  return (
    <div>
      <Suspense fallback={<div className="flex justify-center items-center h-[80vh]">
        <div className=""><LoaderCircle className="animate-spin" /></div>
      </div>}>
        <Section />

      </Suspense>
    </div>
  );
}

export default HomePage;