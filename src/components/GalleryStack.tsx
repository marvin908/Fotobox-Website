import React, { useState, useEffect, useRef } from "react";

interface GalleryItem {
  src: string;
  alt: string;
}

const items: GalleryItem[] = [
  { src: "/gallery/foto-6.jpg", alt: "Golden Magic Mirror Fotobox vor Kirchturm – Elegantes Event Österreich" },
  { src: "/gallery/foto-5.jpg", alt: "Brautpaar vor Golden Magic Mirror Fotobox – Hochzeit Niederösterreich" },
  { src: "/gallery/foto-4.jpg", alt: "Zwei Damen im Abendkleid vor Magic Mirror Fotobox – Hochzeitsfeier Wien" },
  { src: "/gallery/foto-3.jpg", alt: "Golden Magic Mirror Fotobox im Garten – Outdoor Event Niederösterreich" },
  { src: "/gallery/foto-2.jpg", alt: "Hand tippt auf LED-Spiegel Touchscreen – Magic Mirror Fotobox Bedienung" },
  { src: "/gallery/foto-1.jpg", alt: "Golden Magic Mirror Fotobox mit Banner vor Schloss – Wittmann Eventbox Wien" },
];

const INTERVAL = 3200;

export default function GalleryStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animated, setAnimated] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const timers = items.map((_, i) =>
      setTimeout(() => setAnimated((prev) => [...prev, i]), 150 * i)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const handleUserSelect = (i: number) => {
    setActiveIndex(i);
    setPaused(true);
    // Resume after 6 seconds of inactivity
    setTimeout(() => setPaused(false), 6000);
  };

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", padding: "0 20px", boxSizing: "border-box" }}>
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => handleUserSelect(i)}
            style={{
              position: "relative",
              height: activeIndex === i ? "85vw" : "64px",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "height 0.55s cubic-bezier(.4,0,.2,1), border-color 0.4s",
              backgroundImage: `url('${item.src}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: `2px solid ${activeIndex === i ? "rgba(221,170,68,.55)" : "rgba(255,255,255,.07)"}`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  activeIndex === i
                    ? "linear-gradient(to top, rgba(0,0,0,.72) 0%, transparent 55%)"
                    : "rgba(0,0,0,.45)",
                transition: "background 0.55s",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "20px",
                transform: "translateY(-50%)",
                opacity: activeIndex === i ? 0 : 0.55,
                transition: "opacity 0.4s",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "2px",
                pointerEvents: "none",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "14px",
                left: "18px",
                opacity: activeIndex === i ? 1 : 0,
                transform: activeIndex === i ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.45s, transform 0.45s",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "20px",
                  color: "rgba(221,170,68,1)",
                  textShadow: "0 1px 10px rgba(0,0,0,.9)",
                  letterSpacing: "0.5px",
                }}
              >
                Golden Magic Mirror
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
        height: "520px",
        padding: "0 clamp(16px, 3vw, 32px)",
        boxSizing: "border-box",
        gap: "6px",
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => handleUserSelect(i)}
          style={{
            position: "relative",
            flex: activeIndex === i ? "7 1 0%" : "1 1 0%",
            minWidth: activeIndex === i ? undefined : "48px",
            transition:
              "flex 0.65s cubic-bezier(.4,0,.2,1), box-shadow 0.65s, border-color 0.4s, opacity 0.5s, transform 0.5s",
            opacity: animated.includes(i) ? 1 : 0,
            transform: animated.includes(i) ? "translateX(0)" : "translateX(-50px)",
            backgroundImage: `url('${item.src}')`,
            backgroundSize: activeIndex === i ? "cover" : "auto 115%",
            backgroundPosition: "center",
            borderRadius: activeIndex === i ? "10px" : "6px",
            border: `2px solid ${activeIndex === i ? "rgba(221,170,68,.55)" : "rgba(255,255,255,.06)"}`,
            cursor: "pointer",
            overflow: "hidden",
            boxShadow:
              activeIndex === i
                ? "0 20px 60px rgba(0,0,0,.65)"
                : "0 6px 20px rgba(0,0,0,.35)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                activeIndex === i
                  ? "linear-gradient(to top, rgba(0,0,0,.72) 0%, transparent 55%)"
                  : "rgba(0,0,0,.38)",
              transition: "all 0.65s",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "18px",
              left: "18px",
              opacity: activeIndex === i ? 1 : 0,
              transform: activeIndex === i ? "translateX(0)" : "translateX(18px)",
              transition: "opacity 0.5s 0.1s, transform 0.5s 0.1s",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: "24px",
                color: "rgba(221,170,68,1)",
                textShadow: "0 1px 12px rgba(0,0,0,.9)",
                letterSpacing: "0.5px",
              }}
            >
              Golden Magic Mirror
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: activeIndex === i ? 0 : 0.45,
              transition: "opacity 0.4s",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              pointerEvents: "none",
              writingMode: "vertical-rl",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </div>
        </div>
      ))}
    </div>
  );
}
