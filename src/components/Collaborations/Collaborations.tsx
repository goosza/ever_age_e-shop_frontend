import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Collaborations.css";

type CollabItem = {
  id: string;
  title: string;
  hoverImage: string;
  href?: string;
};

const COLLABS: CollabItem[] = [
  { id: "alpha", title: "ALPHA", hoverImage: "/alpha.gif", href: "/collab/collab-alpha" },
  { id: "beta", title: "BETA", hoverImage: "/beta.png", href: "/collab/collab-beta" },
  { id: "gamma", title: "GAMMA", hoverImage: "/gamma.png", href: "/collab/collab-gamma" },
  { id: "delta", title: "DELTA", hoverImage: "/delta.png", href: "/collab/collab-delta" },
];

const VIDEOS = ["/videos/bg-01.mp4", "/videos/bg-02.mp4", "/videos/bg-03.mp4"];

export const Collaborations: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveVideo((s) => (s + 1) % VIDEOS.length), 8000);
    return () => clearInterval(interval);
  }, []);

  const onClick = (c: CollabItem) => {
    if (!c.href) return;
    if (c.href.startsWith("http")) window.open(c.href, "_blank");
    else navigate(c.href);
  };

  const currentImage = useMemo(
    () => (hovered ? COLLABS.find((c) => c.id === hovered)?.hoverImage : undefined),
    [hovered]
  );

  return (
    <section className="collabs-section" aria-label="Collaborations">
      <div className="collabs-video-wrap" aria-hidden>
        {VIDEOS.map((src, i) => (
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
          {COLLABS.map((c) => (
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
            </button>
          ))}
        </div>

        <div
          className={`collab-hover-image ${hovered ? "visible" : ""}`}
          style={currentImage ? { backgroundImage: `url(${currentImage})` } : undefined}
          aria-hidden
        />
      </div>
    </section>
  );
};

export default Collaborations;
