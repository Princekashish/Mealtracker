"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "./ui/Button";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [loading, setLoading] = useState(false);
  const [userdropdown, setUserDropDown] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handlesignout = async () => {
    try {
      setLoading(true);
      await authClient.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Treat everything under /dashboard/* as "dashboard"
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header
      className={`flex justify-center items-center ${
        isDashboard ? "md:hidden" : ""
      }`}
    >
      <div
        className={`w-full px-3 ${
          isDashboard ? "bg-black" : ""
        } bg-black md:bg-[#F1F1F1] mx-3 my-3 rounded-full md:w-1/2`}
      >
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <div className="flex justify-center items-center gap-1">
            <Link href={"/"} className="bg-black rounded-md w-[40px] flex justify-center items-center p-2">
              <img src="/logoMT.png" alt="" className="w-[40px]" />
            </Link>
            <div
              className={`${
                isDashboard
                  ? "font-Grift block text-white"
                  : "hidden md:block"
              } font-Grift md:text-lg font-medium`}
            >
              <h1 className="md:text-black">MealTracker</h1>
            </div>
          </div>

          {/* User Profile - Right */}
          <div className="flex justify-center items-center relative">
            {user ? (
              <div
                onClick={() => setUserDropDown((pre) => !pre)}
                className={`flex justify-center items-center gap-2 cursor-pointer p-1 ${
                  userdropdown ? "border rounded-full" : ""
                }`}
              >
                <Image
                  src={
                    user.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User avatar"
                  className="rounded-full"
                  width={40}
                  height={40}
                />
                {userdropdown && (
                  <div>
                    <Button
                      onClick={handlesignout}
                      size="sm"
                      className="bg-transparent"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="md:text-black text-white hover:text-red-600" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="md:flex items-center gap-4">
                <Link href="/login" className={`${isDashboard ? "" : "hidden"}`}>
                  <Button
                    variant="link"
                    size="sm"
                    className={`hover:text-gray-500 ${
                      isDashboard ? "text-white" : "text-white"
                    } md:text-[#303030] text-lg rounded-full flex justify-center items-center gap-2`}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/login" className={`${pathname === "/" ? "block" : "hidden"}`}>
                  <Button
                    size="sm"
                    variant="link"
                    className="hover:text-gray-500 text-white md:text-[#303030] text-lg rounded-full flex justify-center items-center gap-2"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
