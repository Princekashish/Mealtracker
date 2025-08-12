"use client";
import { CreationSection } from "./creation-section";
import { FeatureSection } from "./feature-section";
import { Testimonials } from "./testimonials";
import { UserJourneys } from "./user-journeys";
import React, { Suspense, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Hero from "./hero-section";
const AppShowcase = React.lazy(() => import("./app-showcase"));
const FloatingIcons = React.lazy(() => import("./floting-icons"))


export default function Section() {
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Hero section entrance animations
    const tl = gsap.timeline();

    tl.fromTo(
      ".hero-icon",
      {
        y: 50,
        opacity: 0,
        rotation: -10
      },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
      }
    )
      .fromTo(
        ".hero-title",
        {
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out"
        },
        "-=0.8"
      )
      .fromTo(
        ".hero-description",
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out"
        },
        "-=0.8"
      )
      .fromTo(
        ".hero-buttons",
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2
        },
        "-=0.6"
      )
      .fromTo(
        ".hero-badge",
        {
          scale: 0.8,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        },
        "-=0.4"
      );

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;

          // Different animation based on element class
          if (element.classList.contains("animate-on-scroll")) {
            gsap.fromTo(
              element,
              {
                y: 100,
                opacity: 0,
                scale: 0.95
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out"
              }
            );
          }

          if (element.classList.contains("feature-card")) {
            gsap.fromTo(
              element,
              {
                y: 60,
                opacity: 0,
                rotationY: 15
              },
              {
                y: 0,
                opacity: 1,
                rotationY: 0,
                duration: 0.8,
                ease: "power3.out"
              }
            );
          }

          if (element.classList.contains("testimonial-item")) {
            gsap.fromTo(
              element,
              {
                x: 100,
                opacity: 0,
                scale: 0.9
              },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out"
              }
            );
          }

          if (element.classList.contains("floating-icons")) {
            gsap.fromTo(
              element,
              {
                y: 50,
                opacity: 0,
                scale: 0.8
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: "elastic.out(1, 0.3)"
              }
            );
          }

          // Stop observing after animation
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      ".animate-on-scroll, .feature-card, .testimonial-item, .floating-icons"
    );
    animatedElements.forEach((el) => observer.observe(el));

    // Parallax effect for floating icons using scroll event
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".floating-icons");

      parallaxElements.forEach((element) => {
        const speed = 0.3;
        const yPos = -(scrolled * speed);
        gsap.set(element, { y: yPos });
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Smooth scroll behavior for anchor links
    const smoothScrollTo = (target: string) => {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    };

    // Add smooth scroll to "How it works" button
    const howItWorksBtn = document.querySelector('.how-it-works-btn');
    if (howItWorksBtn) {
      howItWorksBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo('.feature-section');
      });
    }

    // Cleanup function
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      tl.kill();
    };
  }, []);
  // bg-[#F9FAFB]
  return (
    <div ref={mainRef} className="flex min-h-screen flex-col ">
      <main className="">
        <Hero />
        {/* Floating Icons with Counter */}
        <div className="floating-icons gsap-animated hidden md:block">

          <FloatingIcons />

        </div>

        {/* App Showcase */}
        <div className="animate-on-scroll gsap-animated">
          <Suspense fallback={<div>
            <div className="h-[40vh] bg-red-300 " />
          </div>}>
            <AppShowcase />
          </Suspense>
        </div>

        {/* Features */}
        <div className="feature-section animate-on-scroll gsap-animated">
          <FeatureSection />
        </div>

        {/* Creation Section */}
        <div className="animate-on-scroll gsap-animated">
          <CreationSection />
        </div>

        {/* User Journeys */}
        <div className="animate-on-scroll gsap-animated">
          <UserJourneys />
        </div>

        {/* Testimonials */}
        <div className="testimonials animate-on-scroll gsap-animated">
          <Testimonials />
        </div>
      </main>
    </div>
  );
}
{/*  */ }