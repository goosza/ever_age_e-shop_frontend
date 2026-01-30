import React from "react";
import { useParams, Link } from "react-router-dom";
import { collabs } from "@/data/collab.ts";
import "./CollabPage.css";

const CollabPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const collab = collabs.find((c) => c.id === id) ?? null;

  if (!collab) {
    return (
      <main className="collab-page">
        <div className="collab-right">
          <h1>Collaboration not found</h1>
          <Link to="/">Back to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="collab-page">
      <div className="collab-left">
        <div className="collab-main-image">
          <img src={collab.images[0]} alt={collab.title} />
        </div>
        <div className="collab-gallery">
          {collab.images.slice(1).map((src) => (
            <img key={src} src={src} alt={collab.title} />
          ))}
        </div>
      </div>

      <aside className="collab-right stick-under-header">
        <h1>{collab.title}</h1>
        <p className="collab-desc">{collab.description}</p>
        <div className="collab-actions">
          <Link to="/" className="btn">Back</Link>
        </div>
      </aside>
    </main>
  );
};

export default CollabPage;