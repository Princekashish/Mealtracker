import React from 'react'
import { Button } from './ui/Button'
import { useRouter } from "next/navigation";
import { useAuth } from '@/utils/Auth/AuthProvider';
import { HiArrowLongRight } from "react-icons/hi2";

export default function Hero() {
    const router = useRouter();
    const { user } = useAuth();
    const handlecheck = () => {
        if (user) {
          router.push("/dashboard");
        } else {
          router.push("/auth/login");
        }
      };
  return (
    <div className=' '>
        <section className="container mx-auto px-4 pt-16 pb-16 md:pt-32 md:pb-24 ">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex flex-col justify-center items-center mb-6 hero-icon">
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
              <div className="mt-6 hero-badge">
              <button className="bg-green-50 text-green-700 border-green-200 text-sm px-2 py-1 border-dashed border-[1px] rounded-full">
                {" "}
                ✓ Free for students!
              </button>
            </div>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight md:mb-6 mb-3 hero-title">
              Track your meals with real-time insights.
            </h1>
            <p className="md:text-xl text-sm  text-gray-600 mb-8 max-w-lg mx-auto tracking-tighter md:tracking-tight hero-description">
              Never overpay for your tiffin services again. Track, manage, and
              optimize your meal expenses.
            </p>
            <div className="flex flex-col  items-center sm:flex-row gap-4 justify-center hero-buttons">
              <Button
                size={"lg"}
                onClick={handlecheck}
                className="bg-black hover:bg-gray-800 text-white rounded-full px-8 md:w-1/2  w-3/4 flex justify-center items-center gap-1"
              >
                Get started <HiArrowLongRight size={25}/>
              </Button>

            </div>
         
          </div>
        </section>
    </div>
  )
}
