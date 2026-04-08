import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export default function PulseBorderLink({ to, children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setDims({ w: el.offsetWidth, h: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  // Pill perimeter = 2 rectas horizontales + 2 semicírculos
  // = 2*(w - h) + π*h
  const perimeter = w > 0 ? 2 * (w - h) + Math.PI * h : 0;
  const dashLen = 22;
  const gap = Math.max(perimeter - dashLen, 0);
  const r = h / 2 - 1.5;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {w > 0 && (
        <svg
          style={{ position: "absolute", inset: 0, width: w, height: h, pointerEvents: "none" }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <rect
            x="1.5"
            y="1.5"
            width={w - 3}
            height={h - 3}
            rx={r}
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${dashLen} ${gap}`}
            style={{
              "--neg-perimeter": `${-perimeter}`,
              filter: "drop-shadow(0 0 4px #a78bfa) drop-shadow(0 0 2px #fff)",
            } as React.CSSProperties}
            className="nav-pulse-rect"
          />
        </svg>
      )}
      <Link
        to={to}
        className="relative z-10 block rounded-full px-4 py-2 text-sm font-semibold bg-white text-indigo-600 hover:bg-gray-100 transition-colors"
      >
        {children}
      </Link>
    </div>
  );
}
