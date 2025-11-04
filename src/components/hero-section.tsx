import React from 'react'
import { Button } from './ui/Button'
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const handlecheck = () => {
    router.push("/dashboard");
  };
  return (
    <div className='font-Grift '>
      <section className=" flex justify-center items-center p-10 md:min-h-[70vh]">
        <div className=" flex justify-center items-center flex-col ">
          <div className="flex justify-center items-center gap-1 bg-[#F2F2F2] px-2 py-1 border-dashed border-[1px] rounded-full">
            <div className='w-2 h-2 bg-[#00A63E] rounded-full' />
            <h1 className="text-sm ">Free to use</h1>
          </div>
          <div className='mt-3 text-center'>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium  md:font-semibold tracking-tight md:mb-6 mb-3 hero-title">
              Track your meals with <br /> real-time insights
            </h1>
            <p className="md:text-xl text-sm font-medium  text-gray-600 mb-8 max-w-lg mx-auto tracking-tighter md:tracking-tight hero-description">
              Never overpay for your tiffin services again. Track, manage, and optimize your meal expenses.
            </p>
          </div>
          <Button
            size="lg"
            onClick={handlecheck}
            className="relative overflow-hidden text-white font-bold rounded-full md:w-1/3 flex justify-center items-center gap-1 px-6 py-3"
          >
            {/* Animated gradient border */}
            <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur opacity-75 animate-gradient-border"></span>

            {/* Background image with low opacity */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-full"
              style={{ backgroundImage: "url('/bgback.jpg')", opacity: 0.3 }}
            ></div>

            {/* Button text */}
            <span className="relative z-10">Track to Save</span>
          </Button>



        </div>
      </section>
    </div>
  )
}
