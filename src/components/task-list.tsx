// TaskList.tsx (depois)
import { useDroppable } from "@dnd-kit/react";
import { TaskCard } from "./task-card";
import type { Status, TaskFormData } from "./modal-card";

interface TaskListProps {
  id: Status;
  tasks: TaskFormData[];
}

export function TaskList({ id, tasks }: TaskListProps) {
  const { ref } = useDroppable({
    id,          // mesmo id usado como "group" nos itens
    type: "task",
    accept: "task",
    collisionPriority: tasks.length === 0 ? 1 : 0, // ajuda quando a lista está vazia
  });

  return (
    <div ref={ref} className="flex flex-col bg-amber-400 gap-2 min-h-32">
      {tasks.length > 0 ?
        tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} column={id} />
        )) : (
          <div className="w-full">
            <span className="text-gray-800 text-2xl text-center w-full">
              Solte suas tarefas aqui!
            </span>
          </div>
        )
      }
    </div>
  );
}