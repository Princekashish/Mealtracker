"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const {data:session , isPending} =authClient.useSession()
    const user = session?.user 
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const isPublic = pathname === "/dashboard" || pathname == "/" || pathname.startsWith("/auth");

        if (!isPending && !user && !isPublic) {
            router.replace("/login");
        }
    }, [user, isPending, pathname, router]);

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen ">
                <div className=""><LoaderCircle className="animate-spin" /></div>
            </div>
        );
    }

    return <>{children}</>;
}
