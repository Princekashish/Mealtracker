"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MobileSidebar } from "@/components/mobilenavbar";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { Bell, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";



export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [userdropdown, setUserDropDown] = useState(false);
  const { data: session } = authClient.useSession()
  const user = session?.user

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/dashboard");
  //     router.push("/auth/login");
  //   }
  // }, [user, loading, router]);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[80vh]">
  //       <div className=""><LoaderCircle className="animate-spin" /></div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }




  const handlesignout = async () => {
    await authClient.signOut();
    setUserDropDown(false)
  }




  return (
    <div className="min-h-screen">
      <div className="flex h-screen overflow-hidden justify-between">
        <DashboardSidebar />
        <div className="flex flex-col overflow-hidden w-full min-h-screen ">
          <div className="hidden md:block sticky top-0 border-b-[1px] z-10 p-[16px] ">
            <div className="flex justify-end items-center gap-5  w-full ">
              <div className="flex justify-center items-center gap-4" >
                <div className="md:border md:border-gray-200 h-9 w-10 flex justify-center items-center rounded-xl ">
                  <Bell size={25} className="font-light" />
                </div>

                {user ? (
                  <div
                    onClick={() => setUserDropDown((pre) => !pre)}
                    className={`flex justify-center items-center gap-2 cursor-pointer border  border-gray-200 rounded-3xl  `}
                  >
                    <Image
                      src={
                        user.image ||
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
                    <Link href="/login" className=" cursor-pointer ">
                      <Button variant="outline" size="sm" className="rounded-full md:border-gray-200 md:h-9 border md:px-6 hover:border-accent duration-200">
                        Log in
                      </Button>
                    </Link>
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
          <div className="scrollbar-hide overflow-y-scroll p-3 md:p-5 pt-0 mb-20 md:mb-0">{children}</div>
        </div>
        <MobileSidebar />
      </div>
    </div>
  );
}
