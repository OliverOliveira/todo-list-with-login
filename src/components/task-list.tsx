// TaskList.tsx (depois)
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { TaskCard } from "./task-card";
import type { Status, TaskFormData } from "./modal-card";

interface TaskListProps {
  id: Status;
  tasks: TaskFormData[];
}

export function TaskList({ id, tasks }: TaskListProps) {
  const { ref, isDropTarget } = useDroppable({
    id,          // mesmo id usado como "group" nos itens
    type: "task",
    accept: "task",
    // Low (não Lowest) faz com que a coluna sempre aceite o drop, mas ceda
    // prioridade para os cards individuais quando eles se sobrepõem à coluna.
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-2 min-h-32 rounded-xl transition-colors ${
        isDropTarget ? "bg-violet-900/40 ring-2 ring-violet-500" : ""
      }`}
    >
      {tasks.length > 0 ?
        tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} column={id} />
        )) : (
          <div className="w-full py-6 flex items-center justify-center">
            <span className="text-gray-400 text-sm text-center w-full">
              Solte suas tarefas aqui!
            </span>
          </div>
        )
      }
    </div>
  );
}