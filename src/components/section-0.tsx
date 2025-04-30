"use client";

import { AppShowcase } from "./app-showcase";
import { CreationSection } from "./creation-section";
import { FeatureSection } from "./feature-section";
import { FloatingIcons } from "./floting-icons";
import { Testimonials } from "./testimonials";
import { Button } from "./ui/Button";
import { UserJourneys } from "./user-journeys";

export default function Section() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-500 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                  <path d="M7 2v20" />
                  <path d="M21 15V2" />
                  <path d="M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  <path d="M18 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Track your meals with real-time insights.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto tracking-tight">
              Never overpay for your tiffin services again. Track, manage, and
              optimize your meal expenses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size={"lg"}
                className="bg-black hover:bg-gray-800 text-white rounded-full px-8"
              >
                Get started
              </Button>
              <Button
                variant="outline"
                size={"lg"}
                className="rounded-full px-8"
              >
                How it works →
              </Button>
            </div>
            <div className="mt-6">
              <button className="bg-green-50 text-green-700 border-green-200 text-sm px-2 py-1 border-dashed border-[1px] rounded-full">
                {" "}
                ✓ Free for students!
              </button>
            </div>
          </div>
        </section>

        {/* App Showcase Section */}
        <AppShowcase />

        {/* Floating Icons with Counter */}
        <FloatingIcons />

        {/* Feature Section */}
        <FeatureSection />

        {/* User Journeys Section */}
        <UserJourneys />

        {/* Creation Section */}
        <CreationSection />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Never overpay for meals again.
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start tracking your meals today.{" "}
            <span className="font-semibold text-green-600">
              Always free for students!
            </span>
          </p>
          <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-8">
            Start tracking
          </Button>
        </section>
      </main>
    </div>
  );
}
