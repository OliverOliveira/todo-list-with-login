"use client";

import { TaskFormData } from "@/components/modal-card";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { isSortable } from "@dnd-kit/react/sortable";
import type { DragDropEventHandlers } from "@dnd-kit/react";

interface TaskContextData {
  tasks: TaskFormData[];
  addTask: (task: TaskFormData) => void;
  moveTask: (event: Parameters<DragDropEventHandlers["onDragEnd"]>[0]) => void;
}

interface TaskContextProps {
  children: ReactNode;
}

export const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export function TaskProvider({ children }: TaskContextProps) {
  const [tasks, setTasks] = useState<TaskFormData[]>([]);

  const addTask = useCallback((t: TaskFormData) => {
    setTasks((prev) => [t, ...prev]);
  }, []);

  const moveTask = useCallback(
    (event: Parameters<DragDropEventHandlers["onDragEnd"]>[0]) => {
      if (event.canceled) return;

      const { source } = event.operation;

      if (!isSortable(source)) return;

      const { initialIndex, index, initialGroup, group } = source;

      if (initialGroup == null || group == null) return;

      setTimeout(() => {
        setTasks((prev) => {
          const grouped: Record<string, TaskFormData[]> = {};

          for (const task of prev) {
            const key = task.status;
            (grouped[key] ??= []).push(task);
          }

          if (initialGroup === group) {
            const items = [...(grouped[group] ?? [])];

            const [moved] = items.splice(initialIndex, 1);

            if (!moved) return prev;

            items.splice(index, 0, moved);

            grouped[group] = items;
          } else {
            const from = [...(grouped[initialGroup] ?? [])];

            const [moved] = from.splice(initialIndex, 1);

            if (!moved) return prev;

            const movedTask: TaskFormData = {
              ...moved,
              status: group as TaskFormData["status"],
            };

            const to = [...(grouped[group] ?? [])];

            to.splice(index, 0, movedTask);

            grouped[initialGroup] = from;
            grouped[group] = to;
          }

          return Object.values(grouped).flat();
        });
      }, 1000);
    },
    []
  );

  return (
    <TaskContext.Provider value={{ tasks, addTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}