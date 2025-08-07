"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/utils/Auth/AuthProvider";
import { Bell, LoaderCircle, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Dashboard({ children }: { children: React.ReactNode }) {
const [userdropdown, setUserDropDown] = useState(false);
  const { user, loading, signOut } = useAuth();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/dashboard");
  //     router.push("/auth/login");
  //   }
  // }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className=""><LoaderCircle className="animate-spin" /></div>
      </div>
    );
  }

  // if (!user) {
  //   return null;
  // }


  const handlesignout = () => {
    signOut();
    setUserDropDown(false)
  }

  return (
    <div className="min-h-screen">
      <div className="flex h-screen overflow-hidden justify-between">
        <DashboardSidebar />
        <div className="flex flex-col overflow-hidden w-full min-h-screen ">
          <div className="hidden md:block sticky top-0 border-b-[1px] z-10 p-[16px] ">
            <div className="flex justify-end items-center gap-5  w-full">
              <div className="md:border md:border-gray-200 h-9 w-10 flex justify-center items-center rounded-xl ">
                <Bell size={25} className="font-light" />
              </div>
              <div >
                {user ? (
                  <div
                    onClick={() => setUserDropDown((pre) => !pre)}
                    className={`flex justify-center items-center gap-2 cursor-pointer border  border-gray-200 rounded-3xl  `}
                  >
                    <Image
                      src={
                        user.photoURL ||
                        "https://avatar.iran.liara.run/public/boy"
                      }
                      alt="User avatar"
                      className=" rounded-full"
                      width={35}
                      height={35}
                    />
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-4 ">
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

                <div className="absolute top-full w-full mt-3 flex justify-center items-center">
                  {userdropdown && (

                    <Button
                      onClick={handlesignout}
                      size="sm"
                      className="flex justify-center text-red-600 items-center gap-2 bg-[#f2f2f2] p-5 hover:bg-black/80 rounded-2xl py-4   duration-500 ease-in-out cursor-pointer"
                    >
                      {" "}
                      <LogOut /> Logout
                    </Button>

                  )}
                </div>
              </div>
            </div>

          </div>
          <div className="scrollbar-hide overflow-y-scroll p-3 md:p-5 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
