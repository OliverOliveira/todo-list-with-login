"use client"

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Logo } from "@/components/logo"
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";


const loginSchema = z.object({
  email: z.email("Introduz um e-mail correto!"),
  password: z.string().min(6, "Mínimo 6 caracteres").max(43, "Máximo de 43 caracteres")
});

type formData = z.infer<typeof loginSchema>;


export default function Home() {
  const {register, reset, handleSubmit, formState: {errors}} = useForm<formData>({
    resolver: zodResolver(loginSchema)
  })

  const {signIn} = useAuth()

  async function onSubmit(data: formData) {
        await signIn(data.email, data.password)
        reset()
    }
  return (
    <div className="flex w-full h-screen bg-black">
      <main className="flex flex-1 flex-col w-full relative justify-center bg-violet-800/10 p-4">
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-4xl bg-linear-60 from-violet-300 to-violet-600 bg-clip-text text-transparent font-bold">Momentum</h1>
          </div>
          <p className="text-white">Faça login para gerenciar suas tarefas.</p>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 min-w-2xl bg-gray-300/20 border border-gray-400 rounded-2xl p-8 py-12" autoComplete="off">
            <Input
                label="E-mail"
                Icon={Mail}
                placeholder="Digite seu e-mail"
                error={errors.email?.message}
                {...register("email")}
            />

            <Input
                label="Senha"
                type="password"
                Icon={Lock}
                placeholder="Digite sua senha"
                error={errors.password?.message}
                {...register("password")}
            />


            <Button
              Icon={ArrowRight}
              text="Entrar"
              onClick={() => {}}
            />
          </form>
        </div>
      </main>
    </div>
  );
}
