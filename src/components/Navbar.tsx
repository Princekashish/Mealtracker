"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/Button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="w-full py-4 flex justify-center items-center bg-white border-b">
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 p-2">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-500 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
              <span>Mealtracker</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              FAQ
            </Link>
          </nav>

          {status === "authenticated" ? (
            <div onClick={() => signOut()}>
              <Image
                src={
                  session.user?.image ||
                  "https://avatar.iran.liara.run/public/boy"
                }
                alt="User avatar"
                className="h-[35px] w-[35px] rounded-full"
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login" className=" cursor-pointer ">
                <Button variant="outline" size="sm" className="rounded-full">
                  Log in
                </Button>
              </Link>
              <Button
                size="sm"
                className="bg-black hover:bg-gray-800 text-white rounded-full"
              >
                Sign up
              </Button>
            </div>
          )}

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t border-gray-100">
          <nav className="flex flex-col gap-4">
            <Link
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm" className="rounded-full">
                Log in
              </Button>
              <Button
                size="sm"
                className="bg-black hover:bg-gray-800 text-white rounded-full"
              >
                Sign up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
