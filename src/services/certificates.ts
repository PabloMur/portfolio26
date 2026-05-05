import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Certificate {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
  imageUrl: string;
  category: string;
  createdAt: Timestamp;
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Certificate, "id">) }));
}

export async function addCertificate(data: Omit<Certificate, "id" | "createdAt">): Promise<Certificate> {
  const payload = { ...data, createdAt: Timestamp.now() };
  const ref = await addDoc(collection(db, "certificates"), payload);
  return { id: ref.id, ...payload };
}

export async function deleteCertificate(id: string): Promise<void> {
  await deleteDoc(doc(db, "certificates", id));
}
