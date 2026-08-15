// app/dashboard/page.tsx
"use client";

import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { ModalCard, TaskFormData } from "@/components/modal-card";
import { PrivateRoute } from "@/components/privateRoute";
import { TaskProvider, useTaskContext } from "@/contexts/TaskContext";
import { DragDropProvider } from "@dnd-kit/react";
import { Plus } from "lucide-react";
import { ReactNode, useState } from "react";

// small internal component that consumes the TaskContext after the provider is mounted
function ModalWithAdd({ modalVisible, setModalVisible }: { modalVisible: boolean; setModalVisible: (state: boolean) => void; }) {
    const { addTask } = useTaskContext();

    function handleSubmit(task: TaskFormData) {
        addTask(task);
        setModalVisible(false);
    }

    return (
        <ModalCard
            open={modalVisible}
            onClose={() => setModalVisible(false)}
            onSubmit={handleSubmit}
        />
    );
}

// Reads the drag handlers from the TaskContext and wires them up to the
// DragDropProvider. This MUST be rendered as a child of <TaskProvider>,
// otherwise useTaskContext() resolves to the default (empty) context value
// and the handlers are undefined, meaning dropped tasks never actually get
// their status updated.
function DragDropBoundary({ children }: { children: ReactNode }) {
    const { handleDragStart, handleDragOver, handleDragEnd } = useTaskContext();

    return (
        <DragDropProvider
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {children}
        </DragDropProvider>
    );
}

export default function DashboradLayout({ children }: { children: ReactNode }) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <PrivateRoute>
            <div className="w-full h-screen grid grid-cols-[16rem_1fr] grid-rows-[4rem_1fr] bg-violet-950">
                <aside className="row-span-2 bg-gray-900 text-white p-4 overflow-y-auto">
                    {/* Menu lateral */}
                    <div className="flex flex-col gap-2 items-center">
                        <div className="flex gap-1 items-center justify-center">
                            <Logo />
                            <h1 className="text-3xl font-bold bg-linear-90 from-violet-400 to-violet-600 bg-clip-text text-transparent">Momentum</h1>
                        </div>
                        <span>Gerenciador de tarefas</span>
                    </div>
                    <div className="w-full mt-8">
                        <Button
                            Icon={Plus}
                            text="Nova tarefa"
                            onClick={() => setModalVisible(!modalVisible)}
                        />
                    </div>
                </aside>

                <header className="col-start-2 flex items-center justify-between px-6 border-b border-violet-900">
                    {/* Topo: título, avatar, notificações etc */}
                </header>

                <main className="col-start-2 overflow-y-auto p-6">
                    <TaskProvider>
                        <DragDropBoundary>
                            {children}
                            <ModalWithAdd modalVisible={modalVisible} setModalVisible={setModalVisible} />
                        </DragDropBoundary>
                    </TaskProvider>
                </main>
            </div>
        </PrivateRoute>
    );
}