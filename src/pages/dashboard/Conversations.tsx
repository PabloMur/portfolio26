import { useState, useEffect } from "react";
import { fetchChatSessions, type ChatSession } from "../../services/analyticsTracker";
import { AiOutlineLoading3Quarters, AiOutlineMail, AiOutlineMessage } from "react-icons/ai";
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

export default function Conversations() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchChatSessions()
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <AiOutlineLoading3Quarters className="text-3xl text-violet-400 animate-spin" />
      </div>
    );
  }

  const withEmail = sessions.filter((s) => s.emailDetected).length;

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div>
        <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-white">Conversaciones</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-xs mb-2">Total</p>
          <p className="text-white text-3xl font-bold">{sessions.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-xs mb-2">Con email</p>
          <p className="text-emerald-400 text-3xl font-bold">{withEmail}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-xs mb-2">Sin email</p>
          <p className="text-white text-3xl font-bold">{sessions.length - withEmail}</p>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AiOutlineMessage size={16} className="text-violet-400" />
          <h2 className="text-white text-sm font-semibold">Historial</h2>
        </div>

        {sessions.length === 0 ? (
          <p className="text-gray-600 text-sm">Sin conversaciones aún.</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => {
              const id = s.id!;
              const isOpen = expanded === id;
              const userMsgs = s.messages.filter((m) => m.role === "user");
              const preview = userMsgs[0]?.content ?? "—";
              return (
                <div key={id} className="border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-xs truncate">{preview}</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">
                        {s.city}, {s.country} · {s.lang?.toUpperCase()} · {userMsgs.length} mensaje{userMsgs.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {s.emailDetected && (
                      <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold shrink-0">
                        <AiOutlineMail size={12} />
                        <span className="hidden sm:inline max-w-24 truncate">{s.email}</span>
                      </span>
                    )}
                    <span className="text-gray-600 text-[10px] shrink-0">{timeAgo(s.timestamp)}</span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-3 border-t border-gray-800 space-y-2">
                      {s.messages.slice(1).map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
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
