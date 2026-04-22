import React from "react";
import { useParams, Link } from "react-router-dom";
import { collabs } from "@/data/collab";
import "@/styles/detail-page.css";
import "./CollabPage.css";

const CollabPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const collab = collabs.find((c) => c.id === id) ?? null;

  if (!collab) {
    return (
      <main className="detail-page">
        <div className="detail-right">
          <h1>Collaboration not found</h1>
          <Link to="/">Back to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="detail-page">
      <div className="detail-left">
        <img src={collab.images[0]} alt={collab.title} />
        {collab.images.length > 1 && (
          <div className="collab-gallery">
            {collab.images.slice(1).map((src) => (
              <img key={src} src={src} alt={collab.title} />
            ))}
          </div>
        )}
      </div>

      <aside className="detail-right">
        <h1>{collab.title}</h1>
        <p className="collab-desc">{collab.description}</p>
        <Link to="/" className="btn">Back</Link>
      </aside>
    </main>
  );
};

export default CollabPage;
