import Link from "next/link";
import { Button } from "./ui/Button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/utils/Auth/AuthProvider";

interface SidebarRoutesProps {
  routes: {
    label: string;
    icon: React.ElementType;
    href: string;
    active: boolean;
  }[];
}

export function DesktopSidebar({ routes }: SidebarRoutesProps) {
  const { user } = useAuth();

  return (
    <>
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
                  className={`flex  justify-start items-center w-full p-2 ${route.active ? "bg-[#FFFBEB] dark:bg-zinc-900  p-2 rounded-xl" : "hover:bg-accent ease-in-out duration-100 hover:rounded-xl "
                    }`}
                >
                  <route.icon
                    className={`mr-2 h-4 w-4 text-lg flex justify-center items-center  ${route.active ? "text-amber-700 dark:text-white" : ""
                      }`}
                  />
                  <span className={` ${route.active ? "text-amber-700 dark:text-white" : "dark:text-[#c9c9c9]"}`}>
                    {route.label}
                  </span>
                </Link>
              </button>
            ))}
          </div>
        </div>
        <div className=" w-full flex justify-start items-center p-2">
          {
            user ? (
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-start "
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-start "
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log in
                </Button>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}
