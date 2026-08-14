"use client";

import { TaskList } from "@/components/task-list";
import { useTaskContext } from "@/contexts/TaskContext";

export default function DashboardPage() {
    const { tasks } = useTaskContext();
    const pendingTasks = tasks.filter((t) => t.status === "pendente");
    const progressTasks = tasks.filter((t) => t.status === "andamento");
    const doneTasks = tasks.filter((t) => t.status === "concluida");

    return (
        <div className="w-full h-full text-white flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-bold">Minhas tarefas</h2>
                <p>Aqui é o ponto de partida do seu fluxo de trabalho.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 min-h-full">
                <div className="bg-black/20 border border-violet-800 rounded-2xl p-8">
                    {/* To-Do */}
                    <h3 className="text-2xl font-bold mb-4">A Fazer</h3>
                    <TaskList id="pendente" tasks={pendingTasks} />
                </div>
                <div className="bg-black/20 border border-violet-800 rounded-2xl p-8">
                    {/* In Progress */}
                    <h3 className="text-2xl font-bold mb-4">Em Progresso</h3>
                    <TaskList id="andamento" tasks={progressTasks} />
                </div>
                <div className="bg-black/20 border border-violet-800 rounded-2xl p-8">
                    {/* Finished */}
                    <h3 className="text-2xl font-bold mb-4">Concluído</h3>
                    <TaskList id="concluida" tasks={doneTasks} />
                </div>
            </div>
        </div>
    )
}