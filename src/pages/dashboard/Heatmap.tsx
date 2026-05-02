import { useState, useEffect, useRef } from "react";
import {
  fetchClickEvents,
  fetchHeatmapReports,
  saveHeatmapReport,
  type ClickEvent,
  type HeatmapReport,
} from "../../services/analyticsTracker";
import { analyzeHeatmapForUI } from "../../services/groq";
import {
  AiOutlineLoading3Quarters,
  AiOutlineRobot,
  AiOutlineClose,
  AiOutlineCopy,
  AiOutlineCheck,
  AiOutlineHistory,
} from "react-icons/ai";

const PAGES = ["/", "/projects", "/about", "/education", "/stack", "/services", "/contact"];

function drawHeatmap(
  canvas: HTMLCanvasElement,
  clicks: { x: number; y: number }[],
  hovers: { x: number; y: number }[]
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, w, h);

  hovers.forEach(({ x, y }) => {
    const px = (x / 100) * w;
    const py = (y / 100) * h;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, w * 0.05);
    grad.addColorStop(0, "rgba(99,102,241,0.18)");
    grad.addColorStop(1, "rgba(99,102,241,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, w * 0.05, 0, Math.PI * 2);
    ctx.fill();
  });

  const radius = Math.max(w, h) * 0.07;
  clicks.forEach(({ x, y }) => {
    const px = (x / 100) * w;
    const py = (y / 100) * h;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
    grad.addColorStop(0, "rgba(167,139,250,0.5)");
    grad.addColorStop(1, "rgba(167,139,250,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  const cellSize = 5;
  const cols = Math.ceil(100 / cellSize);
  const rows = Math.ceil(100 / cellSize);
  const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  clicks.forEach(({ x, y }) => {
    const col = Math.min(Math.floor(x / cellSize), cols - 1);
    const row = Math.min(Math.floor(y / cellSize), rows - 1);
    grid[row][col]++;
  });
  const maxDensity = Math.max(...grid.flat(), 1);
  grid.forEach((row, ri) => {
    row.forEach((count, ci) => {
      if (count === 0) return;
      const intensity = count / maxDensity;
      const px = (ci * cellSize / 100) * w;
      const py = (ri * cellSize / 100) * h;
      const cw = (cellSize / 100) * w;
      const ch = (cellSize / 100) * h;
      const r = Math.round(intensity * 239);
      const g = Math.round((1 - intensity) * 100 + intensity * 68);
      const b = Math.round((1 - intensity) * 250);
      ctx.fillStyle = `rgba(${r},${g},${b},${intensity * 0.7})`;
      ctx.fillRect(px, py, cw, ch);
    });
  });
}

function buildSummary(page: string, clicks: ClickEvent[], hovers: ClickEvent[], allEvents: ClickEvent[]): string {
  const elementCounts: Record<string, number> = {};
  clicks.forEach((c) => {
    const key = c.label || c.element || "—";
    elementCounts[key] = (elementCounts[key] || 0) + 1;
  });
  const top = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const topArea = clicks.filter((c) => c.y < 33).length;
  const midArea = clicks.filter((c) => c.y >= 33 && c.y < 66).length;
  const botArea = clicks.filter((c) => c.y >= 66).length;
  const pct = (n: number) => clicks.length ? `${Math.round((n / clicks.length) * 100)}%` : "0%";

  const desktop = clicks.filter((c) => c.device === "desktop").length;
  const mobile = clicks.filter((c) => c.device === "mobile").length;
  const tablet = clicks.filter((c) => c.device === "tablet").length;

  const pageClickTotals = PAGES.map((p) => ({
    page: p,
    clicks: allEvents.filter((e) => e.page === p && e.type === "click").length,
  }));

  return `
DATOS DE HEATMAP — PORTFOLIO WEB
Página analizada: ${page}
Total de clicks: ${clicks.length}
Total de hovers: ${hovers.length}

ELEMENTOS MÁS CLICKEADOS:
${top.length ? top.map(([label, count]) => `- "${label}": ${count} clicks`).join("\n") : "- Sin datos"}

DISTRIBUCIÓN VERTICAL DE CLICKS:
- Zona superior (0–33% de la página): ${topArea} clicks (${pct(topArea)})
- Zona media (33–66%): ${midArea} clicks (${pct(midArea)})
- Zona inferior (66–100%): ${botArea} clicks (${pct(botArea)})

DISPOSITIVOS:
- Desktop: ${desktop}
- Mobile: ${mobile}
- Tablet: ${tablet}

CLICKS TOTALES POR PÁGINA:
${pageClickTotals.map((p) => `- ${p.page}: ${p.clicks} clicks`).join("\n")}
`.trim();
}

function HistoryItem({ report, date, page }: { report: string; date: string; page: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 flex-1 text-left min-w-0">
          <span className="text-gray-400 text-xs font-mono shrink-0">{date}</span>
          <span className="text-gray-600 text-xs truncate">{report.slice(0, 80)}...</span>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="text-xs text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg"
            title="Copiar"
          >
            {copied ? <AiOutlineCheck size={13} className="text-green-400" /> : <AiOutlineCopy size={13} />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 hover:bg-gray-800 rounded-lg"
          >
            {open ? "Cerrar" : "Ver"}
          </button>
        </div>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <ReportPanel report={report} page={page} date={date} onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

function ReportPanel({
  report,
  page,
  date,
  onClose,
}: {
  report: string;
  page: string;
  date?: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const lines = report.split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-violet-500/30 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-violet-500/5">
        <div className="flex items-center gap-2 min-w-0">
          <AiOutlineRobot size={16} className="text-violet-400 shrink-0" />
          <span className="text-white text-sm font-semibold truncate">Informe UX — {page}</span>
          {date && <span className="text-gray-600 text-xs shrink-0 hidden sm:inline">{date}</span>}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied
              ? <><AiOutlineCheck size={13} className="text-green-400" /> Copiado</>
              : <><AiOutlineCopy size={13} /> Copiar</>
            }
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <AiOutlineClose size={16} />
          </button>
        </div>
      </div>
      <div className="p-5 space-y-1 text-sm leading-relaxed">
        {lines.map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h3 key={i} className="text-violet-300 font-semibold text-xs font-mono tracking-widest uppercase mt-4 mb-2 first:mt-0">
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("- ") || line.startsWith("• ")) {
            return (
              <p key={i} className="text-gray-300 pl-3 border-l border-gray-800">
                {line.replace(/^[-•] /, "")}
              </p>
            );
          }
          if (line.trim() === "") return <div key={i} className="h-1" />;
          return <p key={i} className="text-gray-300">{line}</p>;
        })}
      </div>
    </div>
  );
}

export default function Heatmap() {
  const [allEvents, setAllEvents] = useState<ClickEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("/");
  const [showHovers, setShowHovers] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [report, setReport] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [reportError, setReportError] = useState("");
  const [savedReports, setSavedReports] = useState<HeatmapReport[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchClickEvents()
      .then(setAllEvents)
      .finally(() => setLoading(false));
  }, []);

  const pageEvents = allEvents.filter((c) => c.page === page);
  const clicks = pageEvents.filter((c) => c.type === "click");
  const hovers = pageEvents.filter((c) => c.type === "hover");

  useEffect(() => {
    if (!canvasRef.current) return;
    drawHeatmap(
      canvasRef.current,
      clicks.map((c) => ({ x: c.x, y: c.y })),
      showHovers ? hovers.map((c) => ({ x: c.x, y: c.y })) : []
    );
  }, [clicks, hovers, showHovers]);

  const elementCounts: Record<string, number> = {};
  clicks.forEach((c) => {
    const key = c.label || c.element || "—";
    elementCounts[key] = (elementCounts[key] || 0) + 1;
  });
  const topElements = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    setReport("");
    setReportError("");
    try {
      const summary = buildSummary(page, clicks, hovers, allEvents);
      const result = await analyzeHeatmapForUI(summary);
      const now = new Date().toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
      setReport(result);
      setReportDate(now);
      await saveHeatmapReport(page, result);
      setSavedReports((prev) => [
        { page, report: result, generatedAt: { toDate: () => new Date() } as any },
        ...prev,
      ]);
    } catch {
      setReportError("No se pudo generar el informe. Intentá de nuevo.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleShowHistory = async () => {
    if (showHistory) { setShowHistory(false); return; }
    setShowHistory(true);
    setLoadingHistory(true);
    try {
      const reports = await fetchHeatmapReports(page);
      setSavedReports(reports);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-white">Heatmap</h1>
        </div>
        {!loading && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShowHistory}
              className="flex items-center gap-2 border border-gray-700 hover:border-gray-600 hover:bg-gray-900 text-gray-400 hover:text-white text-sm font-medium px-3 py-2.5 rounded-xl transition-colors"
              title="Ver informes anteriores"
            >
              <AiOutlineHistory size={16} />
              <span className="hidden sm:inline">Historial</span>
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={generatingReport || clicks.length === 0}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              {generatingReport
                ? <><AiOutlineLoading3Quarters size={15} className="animate-spin" /> Analizando...</>
                : <><AiOutlineRobot size={15} /> Generar informe</>
              }
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <AiOutlineLoading3Quarters className="text-3xl text-violet-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Selector de páginas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {PAGES.map((p) => {
              const count = allEvents.filter((c) => c.page === p && c.type === "click").length;
              return (
                <button
                  key={p}
                  onClick={() => { setPage(p); setReport(""); }}
                  className={`rounded-2xl p-4 text-left transition-colors border ${
                    page === p
                      ? "bg-indigo-600/20 border-indigo-500/50"
                      : "bg-gray-900 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <p className="text-gray-500 text-xs font-mono mb-1 truncate">{p}</p>
                  <p className="text-white text-2xl font-bold">{count}</p>
                  <p className="text-gray-600 text-[10px]">clicks</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas */}
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white text-sm font-semibold">
                  <span className="text-violet-400 font-mono">{page}</span>
                </h2>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                    <span className="text-gray-500">clicks ({clicks.length})</span>
                  </span>
                  <button
                    onClick={() => setShowHovers((v) => !v)}
                    className={`flex items-center gap-1 transition-opacity ${showHovers ? "opacity-100" : "opacity-40"}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                    <span className="text-gray-500">hover ({hovers.length})</span>
                  </button>
                </div>
              </div>
              <canvas ref={canvasRef} width={600} height={400} className="w-full rounded-xl" />
              {pageEvents.length === 0 && (
                <p className="text-gray-600 text-xs text-center mt-4">Sin datos para esta página aún.</p>
              )}
            </div>

            {/* Top elementos */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white text-sm font-semibold mb-4">Elementos más clickeados</h2>
              {topElements.length === 0 ? (
                <p className="text-gray-600 text-xs">Sin datos aún.</p>
              ) : (
                <div className="space-y-3">
                  {topElements.map(([label, count], i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-xs truncate flex-1 mr-2">{label}</span>
                        <span className="text-gray-500 text-xs shrink-0">{count}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1">
                        <div
                          className="bg-violet-500 h-1 rounded-full"
                          style={{ width: `${(count / topElements[0][1]) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Informe IA */}
          {reportError && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-3">
              {reportError}
            </p>
          )}
          {report && (
            <ReportPanel
              report={report}
              page={page}
              date={reportDate}
              onClose={() => setReport("")}
            />
          )}

          {/* Historial de informes */}
          {showHistory && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <AiOutlineHistory size={15} className="text-gray-500" />
                  <span className="text-white text-sm font-semibold">Informes anteriores — {page}</span>
                </div>
                <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                  <AiOutlineClose size={16} />
                </button>
              </div>
              {loadingHistory ? (
                <div className="flex justify-center py-8">
                  <AiOutlineLoading3Quarters className="text-violet-400 animate-spin" />
                </div>
              ) : savedReports.length === 0 ? (
                <p className="text-gray-600 text-sm px-5 py-6">No hay informes guardados para esta página.</p>
              ) : (
                <div className="divide-y divide-gray-800">
                  {savedReports.map((r, i) => {
                    const date = r.generatedAt?.toDate?.()?.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }) ?? "";
                    return (
                      <HistoryItem key={r.id ?? i} report={r.report} date={date} page={r.page} />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Últimos clicks */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white text-sm font-semibold mb-4">Últimos clicks — {page}</h2>
            {clicks.length === 0 ? (
              <p className="text-gray-600 text-xs">Sin datos aún.</p>
            ) : (
              <div className="space-y-1">
                {clicks.slice(0, 15).map((c, i) => (
                  <div key={i} className="flex items-center gap-4 py-1.5 border-b border-gray-800 last:border-0 text-xs">
                    <span className="text-gray-500 font-mono w-16 shrink-0">{c.x}%, {c.y}%</span>
                    <span className="text-violet-400 shrink-0">{c.element}</span>
                    <span className="text-gray-300 flex-1 truncate">{c.label || "—"}</span>
                    <span className="text-gray-600 shrink-0">{c.city}, {c.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
