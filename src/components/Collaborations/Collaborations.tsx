import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Collaborations.css";

type Collab = {
  id: string;
  title: string;
  hoverImage: string;
  href?: string;
};

export const Collaborations: React.FC = () => {
  const navigate = useNavigate();

  const collabs: Collab[] = useMemo(
    () => [
      { id: "alpha", title: "ALPHA", hoverImage: "../../public/alpha.gif", href: "/collaboration/alpha" },
      { id: "beta", title: "BETA", hoverImage: "../../public/beta.png", href: "/collaboration/beta" },
      { id: "gamma", title: "GAMMA", hoverImage: "../../public/gamma.png", href: "/collaboration/gamma" },
      { id: "delta", title: "DELTA", hoverImage: "../../public/delta.png", href: "/collaboration/delta" },
    ],
    []
  );

  const videos = useMemo(() => ["/videos/bg-01.mp4", "/videos/bg-02.mp4", "/videos/bg-03.mp4"], []);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveVideo((s) => (s + 1) % videos.length), 8000);
    return () => clearInterval(interval);
  }, [videos.length]);

  const onClick = (c: Collab) => {
    if (!c.href) return;
    if (c.href.startsWith("http")) window.open(c.href, "_blank");
    else navigate(c.href);
  };

  const currentImage = hovered ? collabs.find((c) => c.id === hovered)?.hoverImage : undefined;

  return (
    <section className="collabs-section" aria-label="Collaborations">
      <div className="collabs-video-wrap" aria-hidden>
        {videos.map((src, i) => (
          <video key={src} className={`collabs-video ${i === activeVideo ? "active" : ""}`} src={src} muted playsInline autoPlay loop preload="metadata" />
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