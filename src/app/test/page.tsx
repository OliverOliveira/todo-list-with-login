"use client";

import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";

type Status = "todo" | "doing" | "done";

interface Task {
  id: string;
  title: string;
}

type Board = Record<Status, Task[]>;

const COLUNAS: { id: Status; titulo: string }[] = [
  { id: "todo", titulo: "A Fazer" },
  { id: "doing", titulo: "Em Andamento" },
  { id: "done", titulo: "Concluída" },
];

const initialBoard: Board = {
  todo: [
    { id: "1", title: "Criar wireframe" },
    { id: "2", title: "Escrever textos" },
  ],
  doing: [{ id: "3", title: "Implementar login" }],
  done: [{ id: "4", title: "Configurar repositório" }],
};

function TaskCard({ task, index, column }: { task: Task; index: number; column: Status }) {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    group: column,   // identifica a coluna do item
    type: "task",    // tipos "task" só aceitam outros "task"
    accept: "task",
  });

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "10px 12px",
        marginBottom: 8,
        borderRadius: 8,
        background: "#fff",
        border: "1px solid #e2e2e2",
        cursor: "grab",
      }}
    >
      {task.title}
    </div>
  );
}

function Column({ id, titulo, tasks }: { id: Status; titulo: string; tasks: Task[] }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 220,
        background: "#f4f4f5",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <h3 style={{ marginBottom: 10 }}>{titulo}</h3>
      {tasks.map((task, index) => (
        <TaskCard key={task.id} task={task} index={index} column={id} />
      ))}
    </div>
  );
}

export default function KanbanBoard() {
  const [board, setBoard] = useState<Board>(initialBoard);

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const { source } = event.operation;
        if (!isSortable(source)) return;

        const { initialIndex, index, initialGroup, group } = source;
        if (initialGroup == null || group == null) return;

        setBoard((prev) => {
          if (initialGroup === group) {
            // reordenar dentro da mesma coluna
            const items = [...prev[group as Status]];
            const [moved] = items.splice(initialIndex, 1);
            items.splice(index, 0, moved);
            return { ...prev, [group]: items };
          }

          // mover entre colunas diferentes
          const from = [...prev[initialGroup as Status]];
          const [moved] = from.splice(initialIndex, 1);
          const to = [...prev[group as Status]];
          to.splice(index, 0, moved);

          return { ...prev, [initialGroup]: from, [group]: to };
        });
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {COLUNAS.map((col) => (
          <Column key={col.id} id={col.id} titulo={col.titulo} tasks={board[col.id]} />
        ))}
      </div>
    </DragDropProvider>
  );
}