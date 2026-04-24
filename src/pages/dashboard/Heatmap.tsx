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
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, w, h);
  if (points.length === 0) return;

  const radius = Math.max(w, h) * 0.08;
  points.forEach(({ x, y }) => {
    const px = (x / 100) * w;
    const py = (y / 100) * h;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
    grad.addColorStop(0, "rgba(167,139,250,0.4)");
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
      ctx.fillStyle = `rgba(${r},${g},${b},${intensity * 0.7})`;
      ctx.fillRect(px, py, cw, ch);
    });
  });
}

function HeatmapCanvas({ points, small }: { points: { x: number; y: number }[]; small?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) drawHeatmap(canvasRef.current, points);
  }, [points]);
  return (
    <canvas
      ref={canvasRef}
      width={small ? 300 : 600}
      height={small ? 180 : 380}
      className="w-full rounded-xl"
    />
  );
}

export default function Heatmap() {
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetchClickEvents()
      .then(setClicks)
      .finally(() => setLoading(false));
  }, []);

  const selectedClicks = selected ? clicks.filter((c) => c.page === selected) : [];

  const elementCounts: Record<string, number> = {};
  selectedClicks.forEach((c) => {
    const key = c.label || c.element || "—";
    elementCounts[key] = (elementCounts[key] || 0) + 1;
  });
  const topElements = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

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
          {/* Grilla de heatmaps por página */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PAGES.map((p) => {
              const pageClicks = clicks.filter((c) => c.page === p);
              const isSelected = selected === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelected(isSelected ? null : p)}
                  className={`rounded-2xl overflow-hidden border transition-all text-left ${
                    isSelected
                      ? "border-violet-500 shadow-lg shadow-violet-500/20"
                      : "border-gray-800 hover:border-gray-600"
                  }`}
                >
                  <HeatmapCanvas
                    points={pageClicks.map((c) => ({ x: c.x, y: c.y }))}
                    small
                  />
                  <div className="bg-gray-900 px-3 py-2 flex items-center justify-between">
                    <span className="text-gray-400 text-xs font-mono">{p}</span>
                    <span className={`text-xs font-semibold ${pageClicks.length > 0 ? "text-violet-400" : "text-gray-700"}`}>
                      {pageClicks.length} clicks
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detalle de la página seleccionada */}
          {selected && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white text-sm font-semibold">
                    Detalle — <span className="text-violet-400 font-mono">{selected}</span>
                  </h2>
                  <span className="text-gray-600 text-xs">{selectedClicks.length} clicks</span>
                </div>
                <HeatmapCanvas points={selectedClicks.map((c) => ({ x: c.x, y: c.y }))} />
              </div>

              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <h2 className="text-white text-sm font-semibold mb-4">Más clickeados</h2>
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

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <h2 className="text-white text-sm font-semibold mb-3">Últimos clicks</h2>
                  <div className="space-y-1.5">
                    {selectedClicks.slice(0, 8).map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="text-violet-400 shrink-0 w-10">{c.element}</span>
                        <span className="text-gray-300 flex-1 truncate">{c.label || "—"}</span>
                        <span className="text-gray-600 shrink-0 font-mono">{c.x}%,{c.y}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
