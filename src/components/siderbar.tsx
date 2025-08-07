import Link from "next/link";
import { Button } from "./ui/Button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface SidebarRoutesProps {
  routes: {
    label: string;
    icon: React.ElementType;
    href: string;
    active: boolean;
  }[];
}

export function DesktopSidebar({ routes }: SidebarRoutesProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden  fixed top-4 left-4 z-50 ">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border-hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden  fixed inset-0 bg-black/20 bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`md:hidden bg-white fixed left-0 top-0 h-full w-64  z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col justify-between items-start h-full p-6 border-r-[1px]">
          <div className="w-full">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-8" onClick={() => setMobileMenuOpen(false)}>
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
            <div className="flex flex-col gap-2">
              {routes.map((route) => (
                <button key={route.href} className="w-full">
                  <Link
                    href={route.href}
                    className={`flex justify-start items-center w-full p-3 rounded-lg transition-colors ${route.active
                      ? "bg-[#FFFBEB] text-amber-700"
                      : "hover:bg-gray-100"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <route.icon
                      className={`mr-3 h-5 w-5 ${route.active ? "text-amber-700" : "text-gray-600"
                        }`}
                    />
                    <span className={`font-medium ${route.active ? "text-amber-700" : "text-gray-700"
                      }`}>
                      {route.label}
                    </span>
                  </Link>
                </button>
              ))}
            </div>
          </div>
          <div className="w-full border-t pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 p-3"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col justify-between items-center h-full p-8 border-r-[1px]">
        <Link href="/" className="flex items-center gap-2 font-semibold " >
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
        <div className="flex-1 mt-14">
          <div className="flex flex-col gap-2 p-2 ">
            {routes.map((route) => (
              <button key={route.href}>
                <Link
                  href={route.href}
                  className={`flex justify-start items-center w-full p-2 ${route.active ? "bg-[#FFFBEB] p-2 rounded-xl" : ""
                    }`}
                >
                  <route.icon
                    className={`mr-2 h-4 w-4 text-lg flex justify-center items-center  ${route.active ? "text-amber-700" : ""
                      }`}
                  />
                  <span className={` ${route.active ? "text-amber-700" : ""}`}>
                    {route.label}
                  </span>
                </Link>
              </button>
            ))}
          </div>
        </div>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </>
  );
}
