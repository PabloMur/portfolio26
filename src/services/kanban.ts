import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type KanbanStatus = "todo" | "in-progress" | "done";
export type KanbanPriority = "low" | "medium" | "high";

export interface KanbanProject {
  id: string;
  name: string;
  createdAt: Timestamp;
}

export interface KanbanCard {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: KanbanStatus;
  priority: KanbanPriority;
  order: number;
  createdAt: Timestamp;
}

// --- Projects ---

export async function fetchKanbanProjects(): Promise<KanbanProject[]> {
  const q = query(collection(db, "kanbanProjects"), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<KanbanProject, "id">) }));
}

export async function createKanbanProject(name: string): Promise<KanbanProject> {
  const ref = await addDoc(collection(db, "kanbanProjects"), {
    name,
    createdAt: Timestamp.now(),
  });
  return { id: ref.id, name, createdAt: Timestamp.now() };
}

export async function deleteKanbanProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "kanbanProjects", id));
}

// --- Cards ---

export async function fetchCards(projectId: string): Promise<KanbanCard[]> {
  const q = query(
    collection(db, "kanban"),
    where("projectId", "==", projectId),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<KanbanCard, "id">) }));
}

export async function createCard(
  data: Omit<KanbanCard, "id" | "createdAt">
): Promise<KanbanCard> {
  const ref = await addDoc(collection(db, "kanban"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return { id: ref.id, ...data, createdAt: Timestamp.now() };
}

export async function updateCard(
  id: string,
  data: Partial<Omit<KanbanCard, "id">>
): Promise<void> {
  await updateDoc(doc(db, "kanban", id), data);
}

export async function deleteCard(id: string): Promise<void> {
  await deleteDoc(doc(db, "kanban", id));
}

export async function reorderCards(
  cards: { id: string; status: KanbanStatus; order: number }[]
): Promise<void> {
  const batch = writeBatch(db);
  cards.forEach(({ id, status, order }) => {
    batch.update(doc(db, "kanban", id), { status, order });
  });
  await batch.commit();
}
