"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "./ui/Button";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";


export default function Navbar() {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userdropdown, setUserDropDown] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession()
  const user = session?.user



  const handlesignout = () => {
    // signOut();
    setUserDropDown(false)
  }



  // if (loading) {
  //   return (
  //     <div className="space-y-8 py-5 animate-pulse backdrop-blur-md sticky top-0 z-50 p-10 w-full border-gray-200 bg-white/80">
  //       <div className="flex justify-around items-center">
  //         <div className="h-4 bg-gray-200 rounded-3xl w-24" />
  //         <div className="flex justify-center items-center gap-4">
  //           <div className="h-4 bg-gray-200 rounded-3xl w-24" />
  //           <div className="h-4 bg-gray-200 rounded-3xl w-24" />
  //           <div className="h-4 bg-gray-200 rounded-3xl w-24" />
  //         </div>
  //         <div className="flex justify-center items-center gap-5">
  //           <div className="h-4 bg-gray-200 rounded-3xl w-24" />
  //           <div className="h-9 bg-gray-200 rounded-full w-9" />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <header className={`   flex justify-center items-center   ${pathname === "/dashboard" ? "md:hidden  " : ""}`}>
      <div className="w-full   px-3 bg-black md:bg-[#F1F1F1] mx-3 my-3 rounded-full md:w-1/2">
        <div className="flex h-16 items-center justify-between  ">

          {/* Logo - Center */}
          <div className="flex justify-center items-center  gap-1">
            <div className="bg-black rounded-md w-[40px]  flex justify-center items-center p-2" >
              <img src="./logoMT.png" alt="" className=" w-[40px] " />
            </div>
            <div className="font-Grift md:text-lg font-medium">
              <h1 className="hidden md:block md:text-black">MealTracker</h1>
            </div>
          </div>

          {/* Desktop Navigation - Hidden on dashboard */}
          {pathname !== "/dashboard" && (
            <nav className="hidden md:flex items-center gap-6  rounded-full px-4 py-2">
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
          )}

          {/* User Profile - Right */}
          <div className="flex justify-center items-center relative">
            {user ? (
              <div
                onClick={() => setUserDropDown((pre) => !pre)}
                className={`flex justify-center items-center gap-2 cursor-pointer md:border py-1 md:border-gray-200 rounded-3xl  p-2`}
              >
                <h1 className="hidden md:block font-medium text-gray-600 dark:text-[#f2f2f2]">
                  {user.name}
                </h1>
                <Image
                  src={
                    user.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User avatar"
                  className=" rounded-full "
                  width={30}
                  height={30}
                />
              </div>
            ) : (
              <div className=" md:flex items-center gap-4 ">
                <Link href="/login" className={`${pathname.startsWith("/dashboard") ? "" : "hidden"}`}>
                  <Button variant="link" size="sm" className=" hover:text-gray-500 text-white md:text-[#303030] text-lg md:text-lg rounded-full flex justify-center items-center gap-2">
                    Login
                  </Button>
                </Link>
                <Link href={"/login"} className={`${pathname == "/" ? " block" : "hidden"}`}>
                  <Button
                    size="sm"
                    variant="link"
                    className=" hover:text-gray-500 text-white md:text-[#303030] text-lg md:text-lg rounded-full flex justify-center items-center gap-2 "
                  >
                    Login
                  </Button>
                </Link>
              </div>
            )}

            <div className="absolute top-full w-full mt-3 flex justify-center items-center">
              {userdropdown && (

                <div>


                  <Button
                    onClick={handlesignout}
                    size="sm"
                    className="flex justify-center text-red-600 items-center gap-2 bg-[#f2f2f2] p-5 hover:bg-black/80 rounded-2xl py-4   duration-500 ease-in-out cursor-pointer"
                  >
                    {" "}
                    <LogOut /> Logout
                  </Button>
                </div>



              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}



{/* Mobile menu - only show on home page */ }
{/* {mobileMenuOpen && pathname === "/" && (
        <div
          id="mobile-menu"
          className="md:hidden py-4 px-4 border-t border-gray-100 "
          role="menu"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-4">
            <Link
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
              {user ? (
                <>
                  <div
                    onClick={() => setUserDropDown((pre) => !pre)}
                    className="flex items-center gap-2 cursor-pointer border py-1 border-gray-200 rounded-3xl p-2 w-fit"
                  >
                    <h1 className="font-medium text-gray-600 ">{user.name}</h1>
                    <Image
                      src={
                        user.image ||
                        "https://avatar.iran.liara.run/public/boy"
                      }
                      alt="User avatar"
                      className="rounded-full"
                      width={30}
                      height={30}
                    />
                  </div>
                  {userdropdown && (
                    <div
                      onClick={() => {
                        setUserDropDown(false);
                        setMobileMenuOpen(false);
                        // signOut();
                      }}
                      className="flex flex-col justify-start items-start p-1 bg-[#f6f6f6] rounded-full cursor-pointer mt-2"
                    >
                      <Button
                        size="sm"
                        className="flex justify-center text-red-600 items-center gap-2 cursor-pointer"
                      >
                        <LogOut /> Logout
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link href="/Elogin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="rounded-full w-full">
                      Log in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )} */}
