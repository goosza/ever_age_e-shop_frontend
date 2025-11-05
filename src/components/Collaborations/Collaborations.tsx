import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Collaborations.css";

type Collab = {
  id: string;
  title: string;
  hoverImage: string; // path in public folder, e.g. /collabs/img1.jpg
  href?: string; // optional external link
};

export const Collaborations: React.FC = () => {
  const navigate = useNavigate();

  const collabs: Collab[] = useMemo(
    () => [
      { id: "alpha", title: "ALPHA", hoverImage: "/collabs/alpha.jpg", href: "/collaboration/alpha" },
      { id: "beta", title: "BETA", hoverImage: "/collabs/beta.jpg", href: "/collaboration/beta" },
      { id: "gamma", title: "GAMMA", hoverImage: "/collabs/gamma.jpg", href: "/collaboration/gamma" },
    ],
    []
  );

  // Видео-файлы (положите в public/videos/)
  const videos = useMemo(
    () => ["/videos/bg-01.mp4", "/videos/bg-02.mp4", "/videos/bg-03.mp4"],
    []
  );

  const [hovered, setHovered] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);

  // цикл видео
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((s) => (s + 1) % videos.length);
    }, 8000); // каждые 8с — смена (подберите по длине роликов)
    return () => clearInterval(interval);
  }, [videos.length]);

  // Навигация при клике (используем internal href, если внешний — window.open)
  const onClick = (c: Collab) => {
    if (!c.href) return;
    if (c.href.startsWith("http")) {
      window.open(c.href, "_blank");
    } else {
      navigate(c.href);
    }
  };

  return (
    <section className="collabs-section" aria-label="Collaborations">
      <div className="collabs-video-wrap" aria-hidden>
        {videos.map((src, i) => (
          <video
            key={src}
            className={`collabs-video ${i === activeVideo ? "active" : ""}`}
            src={src}
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
          />
        ))}
        <div className="collabs-video-overlay" />
      </div>

      <div className="collabs-content">
        <div className="collabs-center">
          {collabs.map((c) => (
            <button
              key={c.id}
              className="collab-item"
              onMouseEnter={() => setHovered(c.id)}
              onFocus={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              onBlur={() => setHovered(null)}
              onClick={() => onClick(c)}
              aria-label={`Open ${c.title} collaboration`}
            >
              <span className="collab-text">{c.title}</span>

              {/* фон за текст для текущей hovered коллаборации */}
              <div
                className={`collab-hover-image ${hovered === c.id ? "visible" : ""}`}
                style={{ backgroundImage: `url(${c.hoverImage})` }}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collaborations;