"use client";

import { Calendar } from "lucide-react";
import { TaskFormData } from "./modal-card";
import { useSortable } from "@dnd-kit/react/sortable";

type Prioridade = "baixa" | "media" | "alta";
type Status = "pendente" | "andamento" | "concluida";

interface TaskCardProps {
    task: TaskFormData;
    index: number;
    column: Status;
}

const PRIORITY_STYLES: Record<Prioridade, { label: string; className: string }> = {
    baixa: { label: "LOW", className: "bg-emerald-950 text-emerald-300" },
    media: { label: "MEDIUM", className: "bg-cyan-950 text-cyan-300" },
    alta: { label: "HIGH", className: "bg-rose-950 text-rose-300" },
};

const STATUS_LABELS: Record<Status, string> = {
    pendente: "Pendente",
    andamento: "Em andamento",
    concluida: "Concluída",
};

export function TaskCard({ task, index, column }: TaskCardProps) {
    const priority = PRIORITY_STYLES[task.prioridade];

    const {ref, isDragging} = useSortable({
        id: task.id,
        index,
        group: column,
        type: "task",
        accept: "task"
    });

    return (
        <div className="rounded-2xl w-full max-w-md hover:cursor-grab" style={{  opacity: isDragging ? 0.5 : 1, backgroundColor: task.cor }} ref={ref}>
            <div className="w-full ml-1 rounded-2xl bg-slate-900 p-6">
                <div className="flex items-center justify-between">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${priority.className}`}
                    >
                        {priority.label}
                    </span>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Calendar size={16} />
                        {task.data}
                    </div>
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-50">{task.titulo}</h3>

                <p className="mt-3 text-slate-400">{task.descricao}</p>

                <div className="mt-5">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                        {STATUS_LABELS[task.status]}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;