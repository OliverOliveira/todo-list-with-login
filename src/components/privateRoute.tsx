// src/components/PrivateRoute.tsx
"use client"

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export function PrivateRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}