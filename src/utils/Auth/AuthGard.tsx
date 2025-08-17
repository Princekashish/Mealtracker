"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/utils/Auth/AuthProvider";
import { LoaderCircle } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const isPublic = pathname === "/dashboard" || pathname == "/" || pathname.startsWith("/auth");

        if (!loading && !user && !isPublic) {
            router.replace("/auth/login");
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen ">
                <div className=""><LoaderCircle className="animate-spin" /></div>
            </div>
        );
    }

    return <>{children}</>;
}
