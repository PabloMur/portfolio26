import { useState, useEffect } from "react";
import { fetchPageViews, fetchChatSessions, type PageView, type ChatSession } from "../../services/analyticsTracker";
import { AiOutlineLoading3Quarters, AiOutlineDesktop, AiOutlineMobile, AiOutlineTablet, AiOutlineMail, AiOutlineMessage } from "react-icons/ai";
import { Timestamp } from "firebase/firestore";

function timeAgo(ts: Timestamp): string {
  const diff = Date.now() - ts.toMillis();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric" });
  });
}

export default function Analytics() {
  const [views, setViews] = useState<PageView[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchPageViews(), fetchChatSessions()])
      .then(([v, s]) => { setViews(v); setSessions(s); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <AiOutlineLoading3Quarters className="text-3xl text-violet-400 animate-spin" />
      </div>
    );
  }

  const now = Date.now();
  const msPerDay = 86400000;

  const last7 = views.filter((v) => now - v.timestamp.toMillis() < 7 * msPerDay);
  const last30 = views.filter((v) => now - v.timestamp.toMillis() < 30 * msPerDay);

  // Visitas por día (últimos 7 días)
  const days = last7Days();
  const visitsByDay = days.map((label, i) => {
    const start = new Date();
    start.setDate(start.getDate() - (6 - i));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const count = views.filter((v) => {
      const ms = v.timestamp.toMillis();
      return ms >= start.getTime() && ms < end.getTime();
    }).length;
    return { label, count };
  });

  const maxDay = Math.max(...visitsByDay.map((d) => d.count), 1);

  // Países
  const countryCounts: Record<string, { count: number; code: string }> = {};
  last30.forEach((v) => {
    if (!countryCounts[v.country]) countryCounts[v.country] = { count: 0, code: v.countryCode };
    countryCounts[v.country].count++;
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  // Páginas
  const pageCounts: Record<string, number> = {};
  last30.forEach((v) => {
    pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Dispositivos
  const devices = { desktop: 0, mobile: 0, tablet: 0 };
  last30.forEach((v) => { devices[v.device]++; });
  const totalDevices = last30.length || 1;

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total visitas", value: views.length },
          { label: "Últimos 7 días", value: last7.length },
          { label: "Últimos 30 días", value: last30.length },
          { label: "Países", value: Object.keys(countryCounts).length },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-2">{s.label}</p>
            <p className="text-white text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Visitas por día */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-white text-sm font-semibold mb-6">Visitas últimos 7 días</h2>
        <div className="flex items-end gap-2 h-32">
          {visitsByDay.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-gray-500 text-xs">{d.count || ""}</span>
              <div
                className="w-full bg-indigo-600 rounded-t-md transition-all"
                style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count ? "4px" : "0" }}
              />
              <span className="text-gray-600 text-xs">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top países */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-4">Top países (30d)</h2>
          {topCountries.length === 0 ? (
            <p className="text-gray-600 text-xs">Sin datos aún.</p>
          ) : (
            <div className="space-y-3">
              {topCountries.map(([country, { count, code }]) => (
                <div key={country} className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/20x15/${code.toLowerCase()}.png`}
                    alt={code}
                    className="w-5 h-3.5 object-cover rounded-sm shrink-0"
                  />
                  <span className="text-gray-300 text-xs flex-1 truncate">{country}</span>
                  <span className="text-gray-500 text-xs">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top páginas */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-4">Top páginas (30d)</h2>
          {topPages.length === 0 ? (
            <p className="text-gray-600 text-xs">Sin datos aún.</p>
          ) : (
            <div className="space-y-3">
              {topPages.map(([page, count]) => (
                <div key={page} className="flex items-center gap-2">
                  <span className="text-gray-300 text-xs flex-1 truncate font-mono">{page || "/"}</span>
                  <span className="text-gray-500 text-xs">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dispositivos */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-4">Dispositivos (30d)</h2>
          <div className="space-y-3">
            {[
              { key: "desktop", label: "Desktop", icon: <AiOutlineDesktop size={14} /> },
              { key: "mobile", label: "Mobile", icon: <AiOutlineMobile size={14} /> },
              { key: "tablet", label: "Tablet", icon: <AiOutlineTablet size={14} /> },
            ].map(({ key, label, icon }) => {
              const count = devices[key as keyof typeof devices];
              const pct = Math.round((count / totalDevices) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500">{icon}</span>
                    <span className="text-gray-300 text-xs flex-1">{label}</span>
                    <span className="text-gray-500 text-xs">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1">
                    <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visitas recientes */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-white text-sm font-semibold mb-4">Visitas recientes</h2>
        {views.length === 0 ? (
          <p className="text-gray-600 text-xs">Sin datos aún.</p>
        ) : (
          <div className="space-y-2">
            {views.slice(0, 10).map((v, i) => (
              <div key={v.id ?? i} className="flex items-center gap-4 py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-300 text-xs font-mono flex-1 truncate">{v.page || "/"}</span>
                <span className="text-gray-500 text-xs">{v.city}, {v.country}</span>
                <span className="text-gray-600 text-xs shrink-0">{timeAgo(v.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversaciones del chat */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AiOutlineMessage size={16} className="text-violet-400" />
          <h2 className="text-white text-sm font-semibold">Conversaciones del asistente</h2>
          <span className="ml-auto text-gray-600 text-xs">{sessions.length} total</span>
        </div>
        {sessions.length === 0 ? (
          <p className="text-gray-600 text-xs">Sin conversaciones aún.</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => {
              const id = s.id!;
              const isOpen = expandedSession === id;
              const userMsgs = s.messages.filter((m) => m.role === "user");
              const preview = userMsgs[0]?.content ?? "";
              return (
                <div key={id} className="border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedSession(isOpen ? null : id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-xs truncate">{preview || "—"}</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">{s.city}, {s.country} · {s.lang.toUpperCase()} · {userMsgs.length} msg{userMsgs.length !== 1 ? "s" : ""}</p>
                    </div>
                    {s.emailDetected && (
                      <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold shrink-0">
                        <AiOutlineMail size={12} />
                        {s.email}
                      </span>
                    )}
                    <span className="text-gray-600 text-[10px] shrink-0">{timeAgo(s.timestamp)}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-2 border-t border-gray-800 pt-3">
                      {s.messages.filter((m) => m.role !== "assistant" || s.messages.indexOf(m) > 0).map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-xl px-3 py-1.5 text-xs ${
                            m.role === "user"
                              ? "bg-indigo-600/30 text-indigo-200"
                              : "bg-gray-800 text-gray-400"
                          }`}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
