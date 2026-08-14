"use client";

import { users } from "@/data/users";
import { redirect } from "next/navigation";
import { createContext, ReactNode, useState } from "react";


interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    isLoading: boolean;
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const isAuthenticated = !!user

    async function signIn(email: string, password: string) {
        // Simula um delay de rede, pra parecer uma chamada de API real
        await new Promise((resolve) => setTimeout(resolve, 800));

        const foundUser = users.find(
            (u) => u.email === email && u.password === password
        );

        if (!foundUser) {
            throw new Error("E-mail ou senha inválidos");
        }

        // Removemos a senha antes de guardar no estado/localStorage
        const { password: _, ...userWithoutPassword } = foundUser;

        setUser(userWithoutPassword);
        console.log(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        setIsLoading(false)
        redirect("/dashboard");
    }

    function signOut() {
        setUser(null);
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut, user }}>
            {children}
        </AuthContext.Provider>
    );
}