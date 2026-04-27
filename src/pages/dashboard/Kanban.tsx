import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  fetchKanbanProjects,
  createKanbanProject,
  deleteKanbanProject,
  fetchCards,
  createCard,
  updateCard,
  deleteCard,
  reorderCards,
  type KanbanProject,
  type KanbanCard,
  type KanbanStatus,
  type KanbanPriority,
} from "../../services/kanban";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineLoading3Quarters,
  AiOutlineDelete,
  AiOutlineProject,
  AiOutlineDown,
} from "react-icons/ai";

const COLUMNS: { id: KanbanStatus; label: string; color: string }[] = [
  { id: "todo", label: "Por hacer", color: "text-gray-400" },
  { id: "in-progress", label: "En progreso", color: "text-yellow-400" },
  { id: "done", label: "Hecho", color: "text-green-400" },
];

const PRIORITY_STYLES: Record<KanbanPriority, string> = {
  low: "bg-gray-800 text-gray-400",
  medium: "bg-yellow-900/40 text-yellow-400",
  high: "bg-red-900/40 text-red-400",
};

const PRIORITY_LABELS: Record<KanbanPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

type CardForm = { title: string; description: string; priority: KanbanPriority };
const EMPTY_FORM: CardForm = { title: "", description: "", priority: "medium" };

export default function Kanban() {
  const [projects, setProjects] = useState<KanbanProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<KanbanProject | null>(null);
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingCards, setLoadingCards] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [addingProject, setAddingProject] = useState(false);
  const [showProjectInput, setShowProjectInput] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<KanbanStatus>("todo");
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [cardForm, setCardForm] = useState<CardForm>(EMPTY_FORM);
  const [savingCard, setSavingCard] = useState(false);
  const [cardsError, setCardsError] = useState("");

  useEffect(() => {
    fetchKanbanProjects()
      .then((p) => {
        setProjects(p);
        if (p.length > 0) setSelectedProject(p[0]);
      })
      .finally(() => setLoadingProjects(false));
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setLoadingCards(true);
    setCardsError("");
    fetchCards(selectedProject.id)
      .then(setCards)
      .catch((err) => {
        console.error("fetchCards error:", err);
        setCardsError(err?.message ?? "Error al cargar las tarjetas.");
      })
      .finally(() => setLoadingCards(false));
  }, [selectedProject]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    setAddingProject(true);
    try {
      const p = await createKanbanProject(newProjectName.trim());
      setProjects((prev) => [...prev, p]);
      setSelectedProject(p);
      setNewProjectName("");
      setShowProjectInput(false);
    } finally {
      setAddingProject(false);
    }
  };

  const handleDeleteProject = async (p: KanbanProject) => {
    await deleteKanbanProject(p.id);
    setProjects((prev) => prev.filter((x) => x.id !== p.id));
    if (selectedProject?.id === p.id) {
      const remaining = projects.filter((x) => x.id !== p.id);
      setSelectedProject(remaining[0] ?? null);
    }
  };

  const columnCards = (status: KanbanStatus) =>
    cards.filter((c) => c.status === status).sort((a, b) => a.order - b.order);

  const openCreateCard = (status: KanbanStatus) => {
    setEditingCard(null);
    setModalStatus(status);
    setCardForm(EMPTY_FORM);
    setShowCardModal(true);
  };

  const openEditCard = (card: KanbanCard) => {
    setEditingCard(card);
    setModalStatus(card.status);
    setCardForm({ title: card.title, description: card.description, priority: card.priority });
    setShowCardModal(true);
  };

  const handleSaveCard = async () => {
    if (!cardForm.title.trim() || !selectedProject) return;
    setSavingCard(true);
    try {
      if (editingCard) {
        await updateCard(editingCard.id, cardForm);
        setCards((prev) => prev.map((c) => (c.id === editingCard.id ? { ...c, ...cardForm } : c)));
      } else {
        const maxOrder = Math.max(0, ...columnCards(modalStatus).map((c) => c.order));
        const created = await createCard({
          ...cardForm,
          projectId: selectedProject.id,
          status: modalStatus,
          order: maxOrder + 1,
        });
        setCards((prev) => [...prev, created]);
      }
      setShowCardModal(false);
    } finally {
      setSavingCard(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    await deleteCard(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
    setShowCardModal(false);
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcStatus = source.droppableId as KanbanStatus;
    const dstStatus = destination.droppableId as KanbanStatus;
    const moved = cards.find((c) => c.id === draggableId)!;

    const srcCards = columnCards(srcStatus).filter((c) => c.id !== draggableId);
    const dstCards = srcStatus === dstStatus ? srcCards : columnCards(dstStatus);
    dstCards.splice(destination.index, 0, { ...moved, status: dstStatus });

    const toReorder: { id: string; status: KanbanStatus; order: number }[] = [];
    if (srcStatus === dstStatus) {
      dstCards.forEach((c, i) => toReorder.push({ id: c.id, status: dstStatus, order: i }));
    } else {
      srcCards.forEach((c, i) => toReorder.push({ id: c.id, status: srcStatus, order: i }));
      dstCards.forEach((c, i) => toReorder.push({ id: c.id, status: dstStatus, order: i }));
    }

    setCards((prev) =>
      prev.map((c) => {
        const found = toReorder.find((r) => r.id === c.id);
        return found ? { ...c, ...found } : c;
      })
    );
    await reorderCards(toReorder);
  };

  return (
    <div className="flex flex-col md:flex-row md:h-screen overflow-hidden">
      {/* Desktop projects sidebar */}
      <aside className="hidden md:flex w-52 border-r border-gray-800 flex-col shrink-0 bg-gray-950">
        <div className="px-4 py-5 border-b border-gray-800">
          <p className="text-xs text-violet-400 font-mono tracking-widest uppercase">Proyectos</p>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          {loadingProjects ? (
            <div className="flex justify-center py-8">
              <AiOutlineLoading3Quarters className="text-violet-400 animate-spin" />
            </div>
          ) : (
            <>
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors mb-0.5 ${
                    selectedProject?.id === p.id
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <AiOutlineProject size={14} className="shrink-0" />
                    <span className="text-xs truncate">{p.name}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(p); }}
                    className="opacity-0 group-hover:opacity-100 text-current hover:text-red-400 transition-all shrink-0"
                  >
                    <AiOutlineDelete size={13} />
                  </button>
                </div>
              ))}

              {showProjectInput ? (
                <div className="px-2 mt-2">
                  <input
                    autoFocus
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateProject();
                      if (e.key === "Escape") setShowProjectInput(false);
                    }}
                    placeholder="Nombre del proyecto"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-gray-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
                  />
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={() => setShowProjectInput(false)}
                      className="flex-1 py-1 rounded-lg text-xs text-gray-500 hover:bg-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateProject}
                      disabled={addingProject || !newProjectName.trim()}
                      className="flex-1 py-1 rounded-lg text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                      Crear
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowProjectInput(true)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors w-full mt-1"
                >
                  <AiOutlinePlus size={14} />
                  Nuevo proyecto
                </button>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Mobile project selector bar */}
      <div className="md:hidden border-b border-gray-800 bg-gray-950 shrink-0 px-4 py-3 space-y-2">
        {showProjectInput ? (
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateProject();
                if (e.key === "Escape") setShowProjectInput(false);
              }}
              placeholder="Nombre del proyecto"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
            />
            <button
              onClick={() => setShowProjectInput(false)}
              className="px-3 py-2 rounded-lg text-xs text-gray-500 bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateProject}
              disabled={addingProject || !newProjectName.trim()}
              className="px-3 py-2 rounded-lg text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {addingProject ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Crear"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={selectedProject?.id ?? ""}
                onChange={(e) => {
                  const p = projects.find((x) => x.id === e.target.value);
                  if (p) setSelectedProject(p);
                }}
                className="w-full appearance-none bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors pr-8"
              >
                {loadingProjects && <option>Cargando...</option>}
                {!loadingProjects && projects.length === 0 && <option value="">Sin proyectos</option>}
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <AiOutlineDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <button
              onClick={() => setShowProjectInput(true)}
              className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-indigo-500 active:bg-gray-800 transition-colors shrink-0"
              title="Nuevo proyecto"
            >
              <AiOutlinePlus size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-4 md:p-6">
        {!selectedProject ? (
          <div className="flex items-center justify-center h-40 md:h-full text-gray-600 text-sm">
            Seleccioná o creá un proyecto para empezar.
          </div>
        ) : (
          <>
            <div className="mb-4 md:mb-6">
              <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-1">Kanban</p>
              <h1 className="text-xl font-bold text-white">{selectedProject.name}</h1>
            </div>

            {cardsError && (
              <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3 font-mono break-all">
                {cardsError}
              </p>
            )}

            {loadingCards ? (
              <div className="flex justify-center py-20">
                <AiOutlineLoading3Quarters className="text-2xl text-violet-400 animate-spin" />
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-3 md:gap-4 items-start">
                  {COLUMNS.map((col) => {
                    const colCards = columnCards(col.id);
                    return (
                      <div key={col.id} className="w-[80vw] sm:w-72 md:w-72 shrink-0">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${col.color}`}>{col.label}</span>
                            <span className="text-xs text-gray-600 bg-gray-800 rounded-full px-2 py-0.5">
                              {colCards.length}
                            </span>
                          </div>
                          <button
                            onClick={() => openCreateCard(col.id)}
                            className="text-gray-600 hover:text-white transition-colors p-1"
                          >
                            <AiOutlinePlus size={16} />
                          </button>
                        </div>

                        <Droppable droppableId={col.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-24 rounded-2xl p-2 space-y-2 transition-colors ${
                                snapshot.isDraggingOver ? "bg-gray-800/50" : "bg-gray-900/30"
                              }`}
                            >
                              {colCards.map((card, index) => (
                                <Draggable key={card.id} draggableId={card.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => openEditCard(card)}
                                      className={`bg-gray-900 border rounded-xl p-3 cursor-pointer transition-all ${
                                        snapshot.isDragging
                                          ? "border-indigo-500 shadow-lg shadow-indigo-500/20 rotate-1"
                                          : "border-gray-800 hover:border-gray-700"
                                      }`}
                                    >
                                      <p className="text-white text-sm font-medium mb-1 leading-snug">
                                        {card.title}
                                      </p>
                                      {card.description && (
                                        <p className="text-gray-500 text-xs line-clamp-2 mb-2">
                                          {card.description}
                                        </p>
                                      )}
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_STYLES[card.priority]}`}>
                                        {PRIORITY_LABELS[card.priority]}
                                      </span>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              {colCards.length === 0 && !snapshot.isDraggingOver && (
                                <div
                                  onClick={() => openCreateCard(col.id)}
                                  className="text-center py-6 text-gray-700 text-xs cursor-pointer hover:text-gray-500 transition-colors"
                                >
                                  + Agregar tarea
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                  })}
                </div>
              </DragDropContext>
            )}
          </>
        )}
      </div>

      {/* Card modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold text-sm">
                {editingCard ? "Editar tarea" : "Nueva tarea"}
              </h2>
              <button onClick={() => setShowCardModal(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                <AiOutlineClose size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-mono">Título</label>
                <input
                  autoFocus
                  type="text"
                  value={cardForm.title}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveCard()}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-mono">Descripción</label>
                <textarea
                  rows={3}
                  value={cardForm.description}
                  onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-mono">Prioridad</label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as KanbanPriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCardForm({ ...cardForm, priority: p })}
                      className={`flex-1 py-2 rounded-lg text-xs transition-colors ${
                        cardForm.priority === p
                          ? PRIORITY_STYLES[p]
                          : "bg-gray-800 text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {PRIORITY_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1 pb-safe">
                {editingCard && (
                  <button
                    onClick={() => handleDeleteCard(editingCard.id)}
                    className="p-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors"
                  >
                    <AiOutlineDelete size={18} />
                  </button>
                )}
                <button
                  onClick={() => setShowCardModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCard}
                  disabled={savingCard || !cardForm.title.trim()}
                  className="flex-1 py-3 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {savingCard && <AiOutlineLoading3Quarters size={14} className="animate-spin" />}
                  {editingCard ? "Guardar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
