import { collection, addDoc, updateDoc, doc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ChatSession {
  id?: string;
  messages: { role: "user" | "assistant"; content: string }[];
  emailDetected: boolean;
  email: string;
  lang: string;
  country: string;
  countryCode: string;
  city: string;
  device: "desktop" | "mobile" | "tablet";
  timestamp: Timestamp;
}

export interface ClickEvent {
  id?: string;
  page: string;
  x: number;
  y: number;
  element: string;
  label: string;
  href: string;
  country: string;
  countryCode: string;
  city: string;
  device: "desktop" | "mobile" | "tablet";
  timestamp: Timestamp;
}

export interface PageView {
  id?: string;
  page: string;
  country: string;
  countryCode: string;
  city: string;
  device: "desktop" | "mobile" | "tablet";
  timestamp: Timestamp;
}

function getDevice(): "desktop" | "mobile" | "tablet" {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return "mobile";
  return "desktop";
}

let geoCache: { country: string; countryCode: string; city: string } | null = null;

async function getGeo() {
  if (geoCache) return geoCache;
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    geoCache = {
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "??",
      city: data.city || "Unknown",
    };
  } catch {
    geoCache = { country: "Unknown", countryCode: "??", city: "Unknown" };
  }
  return geoCache;
}

export async function trackVisit(page: string): Promise<void> {
  try {
    const geo = await getGeo();
    await addDoc(collection(db, "pageViews"), {
      page,
      ...geo,
      device: getDevice(),
      timestamp: Timestamp.now(),
    });
  } catch {
    // Silently fail — never break the portfolio
  }
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;

export async function saveChatSession(
  messages: { role: "user" | "assistant"; content: string }[],
  lang: string,
  sessionDocId?: string
): Promise<string | undefined> {
  try {
    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length === 0) return;

    const allUserText = userMessages.map((m) => m.content).join(" ");
    const emailMatch = allUserText.match(EMAIL_REGEX);

    const payload = {
      messages,
      emailDetected: !!emailMatch,
      email: emailMatch ? emailMatch[0] : "",
      lang,
      device: getDevice(),
      updatedAt: Timestamp.now(),
    };

    if (sessionDocId) {
      await updateDoc(doc(db, "chatSessions", sessionDocId), payload);
      return sessionDocId;
    }

    const geo = await getGeo();
    const ref = await addDoc(collection(db, "chatSessions"), {
      ...payload,
      ...geo,
      timestamp: Timestamp.now(),
    });
    return ref.id;
  } catch (err) {
    console.error("[saveChatSession] error:", err);
  }
}

export async function fetchChatSessions(): Promise<ChatSession[]> {
  const q = query(collection(db, "chatSessions"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ChatSession, "id">),
  }));
}

export async function trackClick(
  e: MouseEvent,
  page: string
): Promise<void> {
  try {
    const el = e.target as HTMLElement;
    const interactive = el.closest("a, button, [role='button'], input, select, textarea");
    if (!interactive) return;

    const x = Math.round((e.clientX / window.innerWidth) * 100);
    const y = Math.round(((e.clientY + window.scrollY) / document.documentElement.scrollHeight) * 100);
    const label =
      (interactive as HTMLElement).innerText?.trim().slice(0, 60) ||
      interactive.getAttribute("aria-label") ||
      interactive.getAttribute("title") ||
      "";
    const href = (interactive as HTMLAnchorElement).href || "";

    const geo = await getGeo();
    await addDoc(collection(db, "clickEvents"), {
      page,
      x,
      y,
      element: interactive.tagName.toLowerCase(),
      label,
      href,
      ...geo,
      device: getDevice(),
      timestamp: Timestamp.now(),
    });
  } catch {
    // Silently fail
  }
}

export async function fetchClickEvents(page?: string): Promise<ClickEvent[]> {
  const q = query(collection(db, "clickEvents"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  const all = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ClickEvent, "id">),
  }));
  return page ? all.filter((c) => c.page === page) : all;
}

export async function fetchPageViews(): Promise<PageView[]> {
  const q = query(collection(db, "pageViews"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<PageView, "id">),
  }));
}
