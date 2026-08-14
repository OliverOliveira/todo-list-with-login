"use client";

import { useState } from "react";
import { X, Flag, Calendar, CircleDot, Palette, Plus } from "lucide-react";

export type Prioridade = "baixa" | "media" | "alta";
export type Status = "pendente" | "andamento" | "concluida";

export interface TaskFormData {
  id: ReturnType<typeof window.crypto.randomUUID>;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  data: string;
  status: Status;
  cor: string;
}

interface ModalCardProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (task: TaskFormData) => void;
}

interface PriorityOption {
  id: Prioridade;
  label: string;
  dot: string;
}

interface StatusOption {
  id: Status;
  label: string;
}

const PRIORITIES: PriorityOption[] = [
  { id: "baixa", label: "Baixa", dot: "bg-violet-400" },
  { id: "media", label: "Média", dot: "bg-purple-500" },
  { id: "alta", label: "Alta", dot: "bg-fuchsia-500" },
];

const STATUSES: StatusOption[] = [
  { id: "pendente", label: "Pendente" },
  { id: "andamento", label: "Em andamento" },
  { id: "concluida", label: "Concluída" },
];

const HEX_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;

export function ModalCard({
  open = true,
  onClose = () => {},
  onSubmit = () => {},
}: ModalCardProps) {
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [prioridade, setPrioridade] = useState<Prioridade>("media");
  const [data, setData] = useState<string>("");
  const [status, setStatus] = useState<Status>("pendente");
  const [cor, setCor] = useState<string>("#8B5CF6");
  const [hexTouched, setHexTouched] = useState<boolean>(false);

  const hexValido = HEX_REGEX.test(cor);

  function handleHexChange(value: string) {
    setHexTouched(true);
    if (!value.startsWith("#")) value = "#" + value;
    setCor(value.slice(0, 7));
  }

  function handleSubmit() {
    if (!titulo.trim() || !hexValido) return;
    const id = window.crypto.randomUUID();
    onSubmit({ id, titulo, descricao, prioridade, data, status, cor });
  }

  if (!open) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-50 m-0 h-full w-full max-w-none bg-purple-950/70 backdrop-blur-sm p-0"
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md rounded-2xl border border-purple-800/60 bg-linear-to-b from-purple-900 to-purple-950 shadow-2xl shadow-purple-950/50"
        >
          {/* faixa de cor no topo, refletindo a cor escolhida da tarefa */}
          <div
            className="h-1.5 w-full rounded-t-2xl transition-colors"
            style={{ backgroundColor: hexValido ? cor : "#6D28D9" }}
          />

          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-lg font-semibold text-purple-50">Nova tarefa</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-purple-400 hover:bg-purple-800/60 hover:text-purple-100 transition-colors"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-5 px-6 py-5">
            {/* Título */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-purple-200">
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Revisar proposta do cliente"
                className="w-full rounded-lg border border-purple-800 bg-purple-950/60 px-3 py-2 text-sm text-purple-50 placeholder-purple-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-purple-200">
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Detalhes da tarefa..."
                rows={3}
                className="w-full resize-none rounded-lg border border-purple-800 bg-purple-950/60 px-3 py-2 text-sm text-purple-50 placeholder-purple-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            {/* Prioridade */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-purple-200">
                <Flag size={14} /> Prioridade
              </label>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPrioridade(p.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      prioridade === p.id
                        ? "border-violet-500 bg-violet-500/20 text-violet-100"
                        : "border-purple-800 text-purple-400 hover:border-purple-600 hover:text-purple-200"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Data */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-purple-200">
                  <Calendar size={14} /> Data
                </label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full rounded-lg border border-purple-800 bg-purple-950/60 px-3 py-2 text-sm text-purple-50 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 scheme-dark"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-purple-200">
                  <CircleDot size={14} /> Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="w-full rounded-lg border border-purple-800 bg-purple-950/60 px-3 py-2 text-sm text-purple-50 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                >
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-purple-950">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cor HEX */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-purple-200">
                <Palette size={14} /> Cor da tarefa
              </label>
              <div className="flex items-center gap-2">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-purple-800">
                  <input
                    type="color"
                    value={hexValido ? cor : "#8B5CF6"}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="h-11 w-11 -translate-x-1 -translate-y-1 cursor-pointer border-none bg-transparent p-0"
                    aria-label="Selecionar cor"
                  />
                </div>
                <input
                  type="text"
                  value={cor}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#8B5CF6"
                  maxLength={7}
                  className={`flex-1 rounded-lg border bg-purple-950/60 px-3 py-2 text-sm text-purple-50 placeholder-purple-500 outline-none focus:ring-2 ${
                    hexTouched && !hexValido
                      ? "border-fuchsia-600 focus:border-fuchsia-500 focus:ring-fuchsia-500/30"
                      : "border-purple-800 focus:border-violet-500 focus:ring-violet-500/30"
                  }`}
                />
              </div>
              {hexTouched && !hexValido && (
                <p className="mt-1 text-xs text-fuchsia-400">
                  Informe um HEX válido, ex: #8B5CF6
                </p>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-2 border-t border-purple-800/60 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-800/50 hover:text-purple-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!titulo.trim() || !hexValido}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-600/30 transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              <Plus size={16} />
              Adicionar tarefa
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

