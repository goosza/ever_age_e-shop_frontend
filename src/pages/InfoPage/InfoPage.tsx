import React from "react";
import "./InfoPage.css";

const InfoPage: React.FC = () => {
  return (
    <main className="info-page">
      <div className="info-left">
        <div className="gallery">
          <img src="/placeholder.png" alt="Info image 1" />
          <img src="/placeholder.png" alt="Info image 2" />
        </div>
      </div>

      <aside className="info-right">
        <h1>Information</h1>
        <p className="lead">
          Краткое введение — пара предложений о компании/продукте/политике.
        </p>

        <section>
          <h2>Details</h2>
          <p>
            Здесь подробный текст. Используйте заголовки и абзацы для удобного чтения.
          </p>
        </section>

        <section>
          <h2>More</h2>
          <p>
            Дополнительная информация, контакты, ссылки и т.д.
          </p>
        </section>
      </aside>
    </main>
  );
};

export default InfoPage;