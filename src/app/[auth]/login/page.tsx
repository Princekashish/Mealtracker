"use client";
import { CircleArrowLeft } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomeBack() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black  text-white p-4 relative">
      <Link href="/" className="absolute top-10 left-10">
        <CircleArrowLeft size={30} />
      </Link>
      <div className="flex flex-col items-center justify-center w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center w-12 h-12 bg-amber-500 rounded-xl mb-4">
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

        {/* Welcome Text */}
        <h1 className="text-4xl font-bold mb-12">Welcome back</h1>

        {/* Google Login Button */}
        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center w-full p-3 mb-4 border border-gray-700 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="mr-2" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Other Options Button */}
        <button className="w-full p-3 mb-8 border border-gray-700 rounded-full hover:bg-white/10 transition-colors">
          See other options
        </button>

        {/* Divider */}
        <div className="flex items-center w-full mb-8">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="px-4 text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        {/* Email Form */}
        <div className="w-full">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-transparent border-2 border-gray-700 rounded-3xl text-white focus:outline-none px-3 focus:border-white"
            />
          </div>

          <button className="w-full p-3 bg-white text-black rounded-full font-medium hover:bg-white/70 transition-colors cursor-pointer">
            Continue
          </button>
        </div>

        {/* Terms and Privacy */}
        <p className="mt-6 text-xs text-gray-400">
          By continuing, you agree to Mobbin's{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
