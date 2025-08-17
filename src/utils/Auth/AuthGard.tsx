"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/utils/Auth/AuthProvider";

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
            <div className="flex items-center justify-center min-h-screen">
                <p>Checking authentication...</p>
            </div>
        );
    }

    return <>{children}</>;
}
