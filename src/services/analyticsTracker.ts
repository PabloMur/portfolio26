import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
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
  lang: string
): Promise<void> {
  try {
    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length === 0) return;

    const allUserText = userMessages.map((m) => m.content).join(" ");
    const emailMatch = allUserText.match(EMAIL_REGEX);

    const geo = await getGeo();
    await addDoc(collection(db, "chatSessions"), {
      messages,
      emailDetected: !!emailMatch,
      email: emailMatch ? emailMatch[0] : "",
      lang,
      ...geo,
      device: getDevice(),
      timestamp: Timestamp.now(),
    });
  } catch {
    // Silently fail
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

export async function fetchPageViews(): Promise<PageView[]> {
  const q = query(collection(db, "pageViews"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<PageView, "id">),
  }));
}
