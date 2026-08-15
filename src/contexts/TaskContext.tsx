"use client";

import { TaskFormData, Status } from "@/components/modal-card";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { isSortable } from "@dnd-kit/react/sortable";
import { type DragOverEvent, type DragEndEvent } from "@dnd-kit/react";

interface TaskContextData {
  tasks: TaskFormData[];
  addTask: (task: TaskFormData) => void;
  handleDragStart: () => void;
  handleDragOver: (e: DragOverEvent) => void;
  handleDragEnd: (e: DragEndEvent) => void;
}

interface TaskContextProps {
  children: ReactNode;
}

export const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export function TaskProvider({ children }: TaskContextProps) {
  const [tasks, setTasks] = useState<TaskFormData[]>([]);

  // Keeps a ref mirror of `tasks` so we can snapshot it synchronously in
  // `handleDragStart` (for cancel/revert) without stale-closure issues.
  const tasksRef = useRef<TaskFormData[]>(tasks);
  const previousTasksRef = useRef<TaskFormData[]>(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const addTask = useCallback((t: TaskFormData) => {
    setTasks((prev) => [t, ...prev]);
  }, []);

  // Figures out which column (status) and position a drag operation is
  // currently over, and moves the task there in state.
  //
  // IMPORTANT: this is called from `onDragOver`, not `onDragEnd`. dnd-kit's
  // useSortable already moves the dragged card's DOM node between columns
  // optimistically (outside of React) as soon as it crosses into a new
  // group. If we only sync our React state on drop (onDragEnd), React's
  // reconciliation and dnd-kit's own DOM bookkeeping end up fighting over
  // a node that was already relocated, which throws
  // "Failed to execute 'removeChild' on 'Node'" (a known dnd-kit issue:
  // https://github.com/clauderic/dnd-kit/issues/1747 and #1940). Updating
  // state in `onDragOver` instead keeps React's tree in sync with dnd-kit's
  // optimistic DOM changes at every step, which is also what dnd-kit's own
  // "Multiple sortable lists" guide recommends.
  const moveTaskToTarget = useCallback((event: DragOverEvent | DragEndEvent) => {
    const { source, target } = event.operation;

    if (!source) return;

    const taskId = source.id;

    // We read the destination from `target` rather than only from
    // `source.group`/`source.index` because `source` only reflects the
    // destination once dnd-kit's optimistic sorting has matched the drag
    // against a sibling card. When a column is empty (or the user hovers
    // empty space below the cards) there's no sibling to collide with, so
    // `target` (the column's own droppable, or the card being hovered) is
    // the reliable source of truth for the destination.
    let destGroup: Status | undefined;
    let destIndex: number | undefined;

    if (target && isSortable(target)) {
      // Hovering on/near a card: use that card's column and index.
      destGroup = (target.group ?? (target.id as Status)) as Status;
      destIndex = target.index;
    } else if (target) {
      // Hovering the column container itself (typically an empty column,
      // or empty space within a non-empty column).
      destGroup = target.id as Status;
    } else if (isSortable(source)) {
      // Fallback: no target resolved, trust dnd-kit's own tracked group/index.
      destGroup = source.group as Status;
      destIndex = source.index;
    }

    if (!destGroup) return;

    setTasks((prev) => {
      const current = prev.find((t) => t.id === taskId);

      if (!current) return prev;

      const rest = prev.filter((t) => t.id !== taskId);

      const movedTask: TaskFormData =
        current.status === destGroup
          ? current
          : { ...current, status: destGroup as TaskFormData["status"] };

      // Split so we can insert the moved task at the right position within
      // its destination column, while leaving every other column untouched.
      const destItems = rest.filter((t) => t.status === destGroup);
      const otherItems = rest.filter((t) => t.status !== destGroup);

      const insertAt =
        destIndex != null
          ? Math.min(Math.max(destIndex, 0), destItems.length)
          : destItems.length;

      // No-op guard: avoid triggering a state update (and re-render) when
      // nothing actually changed, since onDragOver can fire repeatedly.
      const alreadyInPlace =
        current.status === destGroup && destItems[insertAt] === current;

      if (alreadyInPlace) return prev;

      destItems.splice(insertAt, 0, movedTask);

      return [...otherItems, ...destItems];
    });
  }, []);

  const handleDragStart = useCallback(() => {
    previousTasksRef.current = tasksRef.current;
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      moveTaskToTarget(event);
    },
    [moveTaskToTarget]
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // If the drag was canceled (e.g. the user pressed Escape), dnd-kit
    // automatically reverts its own optimistic DOM changes. We need to
    // revert our React state to match, since we've been committing moves
    // live during onDragOver.
    if (event.canceled) {
      setTasks(previousTasksRef.current);
    }
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, handleDragStart, handleDragOver, handleDragEnd }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}
