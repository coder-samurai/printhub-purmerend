import "../styles/Hero.css";
import ModelViewer from "./ModelViewer";

export default function Hero({ modelUrl }) {
  return (
    <section className="hero container">
      <div className="hero-content">
        <div className="hero-text">
          <h1>PrintHub Purmerend</h1>
          <p>
            Dé 3D-printservice voor iedereen — upload je model en ontvang direct een schatting van tijd en prijs.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Bestand uploaden</button>
            <button className="btn-secondary">Bestellingen bekijken</button>
          </div>
        </div>

        <div className="hero-visual">
          <ModelViewer url={modelUrl} />
        </div>
      </div>
    </section>
  );
}
