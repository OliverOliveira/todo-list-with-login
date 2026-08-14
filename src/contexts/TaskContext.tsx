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
import { useDndMonitor } from "@dnd-kit/core";

interface TaskContextData {
  tasks: TaskFormData[];
  addTask: (task: TaskFormData) => void;
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

  // useDndMonitor is used to listen for drag end events from within the DnD context.
  // Putting the handler here (and ensuring TaskProvider is rendered inside DragDropProvider)
  // avoids scheduling React state updates inside useInsertionEffect used internally by dnd-kit.
  useDndMonitor({
    onDragEnd: (event) => {
      if (event.canceled) return;

      const { source } = event.operation;

      if (!isSortable(source)) return;

      const { initialIndex, index, initialGroup, group } = source;

      if (initialGroup == null || group == null) return;

      setTasks((prev) => {
        // Build grouped lists (no mutation of original tasks)
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

        // Return flattened tasks preserving grouping; this mirrors previous behavior
        return Object.values(grouped).flat();
      });
    },
  });

  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}