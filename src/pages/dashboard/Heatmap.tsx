import { useState, useEffect, useRef } from "react";
import { fetchClickEvents, type ClickEvent } from "../../services/analyticsTracker";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PAGES = ["/", "/projects", "/about", "/education", "/stack", "/services", "/contact"];

function drawHeatmap(canvas: HTMLCanvasElement, points: { x: number; y: number }[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Dark bg
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, w, h);

  if (points.length === 0) return;

  // Draw each point as radial gradient
  const radius = Math.max(w, h) * 0.06;
  points.forEach(({ x, y }) => {
    const px = (x / 100) * w;
    const py = (y / 100) * h;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
    grad.addColorStop(0, "rgba(167,139,250,0.35)");
    grad.addColorStop(1, "rgba(167,139,250,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Second pass: hot zones
  const cellSize = 5;
  const cols = Math.ceil(100 / cellSize);
  const rows = Math.ceil(100 / cellSize);
  const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  points.forEach(({ x, y }) => {
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
      ctx.fillStyle = `rgba(${r},${g},${b},${intensity * 0.6})`;
      ctx.fillRect(px, py, cw, ch);
    });
  });
}

export default function Heatmap() {
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("/");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchClickEvents()
      .then(setClicks)
      .finally(() => setLoading(false));
  }, []);

  const filtered = clicks.filter((c) => c.page === page);

  useEffect(() => {
    if (!canvasRef.current) return;
    drawHeatmap(canvasRef.current, filtered.map((c) => ({ x: c.x, y: c.y })));
  }, [filtered]);

  // Top elementos clickeados
  const elementCounts: Record<string, number> = {};
  filtered.forEach((c) => {
    const key = c.label || c.element || "—";
    elementCounts[key] = (elementCounts[key] || 0) + 1;
  });
  const topElements = Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Pages con datos
  const pagesWithData = PAGES.filter((p) => clicks.some((c) => c.page === p));

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-white">Heatmap</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <AiOutlineLoading3Quarters className="text-3xl text-violet-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats globales */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PAGES.map((p) => {
              const count = clicks.filter((c) => c.page === p).length;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-2xl p-4 text-left transition-colors border ${
                    page === p
                      ? "bg-indigo-600/20 border-indigo-500/50"
                      : "bg-gray-900 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <p className="text-gray-500 text-xs font-mono mb-1">{p || "/"}</p>
                  <p className="text-white text-2xl font-bold">{count}</p>
                  <p className="text-gray-600 text-[10px]">clicks</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Heatmap canvas */}
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white text-sm font-semibold">
                  Clicks en <span className="text-violet-400 font-mono">{page}</span>
                </h2>
                <span className="text-gray-600 text-xs">{filtered.length} clicks</span>
              </div>
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full rounded-xl"
              />
              {filtered.length === 0 && (
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
                  {topElements.map(([label, count], i) => {
                    const max = topElements[0][1];
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-300 text-xs truncate flex-1 mr-2">{label}</span>
                          <span className="text-gray-500 text-xs shrink-0">{count}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1">
                          <div
                            className="bg-violet-500 h-1 rounded-full"
                            style={{ width: `${(count / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Últimos clicks */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white text-sm font-semibold mb-4">Últimos clicks — {page}</h2>
            {filtered.length === 0 ? (
              <p className="text-gray-600 text-xs">Sin datos aún.</p>
            ) : (
              <div className="space-y-1">
                {filtered.slice(0, 15).map((c, i) => (
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
