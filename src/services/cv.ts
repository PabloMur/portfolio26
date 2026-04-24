import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface CV {
  id?: string;
  name: string;
  url: string;
  active: boolean;
  uploadedAt: Timestamp;
}

export async function fetchCVs(): Promise<CV[]> {
  const q = query(collection(db, "cvs"), orderBy("uploadedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CV, "id">) }));
}

export async function uploadCV(name: string, url: string): Promise<CV> {
  const ref = await addDoc(collection(db, "cvs"), {
    name,
    url,
    active: false,
    uploadedAt: Timestamp.now(),
  });
  return { id: ref.id, name, url, active: false, uploadedAt: Timestamp.now() };
}

export async function setActiveCV(id: string, allIds: string[]): Promise<void> {
  await Promise.all(
    allIds.map((cvId) =>
      updateDoc(doc(db, "cvs", cvId), { active: cvId === id })
    )
  );
}

export async function deleteCV(id: string): Promise<void> {
  await deleteDoc(doc(db, "cvs", id));
}

export async function fetchActiveCV(): Promise<CV | null> {
  const cvs = await fetchCVs();
  return cvs.find((c) => c.active) ?? null;
}
