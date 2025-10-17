import { useState } from "react";
import "../styles/UploadSection.css";
import { API_BASE } from "../config";

export default function UploadSection({ setModelUrl }) {
  const [fileName, setFileName] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);

  const MAX_SIZE_MB = 50;
  const ALLOWED_EXT = [".stl", ".obj"];

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (!ALLOWED_EXT.some(ext => lowerName.endsWith(ext))) {
      return setBanner({ type: "error", text: "Alleen .STL of .OBJ bestanden zijn toegestaan." });
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return setBanner({ type: "error", text: `Maximale bestandsgrootte is ${MAX_SIZE_MB}MB.` });
    }

    setLoading(true);
    setBanner(null);
    setFileName(file.name);

    try {
      // stap 1: upload bestand
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`${API_BASE}/files`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.message);

      // model tonen
      const fileUrl = `${API_BASE.replace("/api", "")}/uploads/${uploadData.data.filename}`;
      setModelUrl && setModelUrl(fileUrl);

      // stap 2: schatting berekenen
      const estimateRes = await fetch(`${API_BASE}/estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sizeBytes: uploadData.data.sizeBytes,
          material: "PLA",
          quality: "standard",
        }),
      });

      const estimateData = await estimateRes.json();
      if (!estimateData.success) throw new Error(estimateData.message);

      setEstimate(estimateData.data);
      setBanner({ type: "success", text: "Upload en berekening geslaagd!" });
    } catch (err) {
      console.error(err);
      setBanner({ type: "error", text: err.message || "Er is een fout opgetreden." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container upload-wrap scroll-animate">
      {banner && (
        <div className={`banner ${banner.type}`}>
          <div className="banner__icon">{banner.type === "success" ? "✅" : "⚠️"}</div>
          <div className="banner__text">{banner.text}</div>
          <button className="banner__close" onClick={() => setBanner(null)}>×</button>
        </div>
      )}

      <div className="cards-grid">
        <div className="card upload-card">
          <h3>Upload bestand</h3>
          <p className="upload-info">
            Ondersteunde formaten: <strong>.STL, .OBJ</strong><br />
            Maximale grootte: <strong>{MAX_SIZE_MB}MB</strong>
          </p>

          <div className="file-row">
            <span className={`status-dot ${estimate ? "ok" : ""}`}></span>
            <span className="file-name">{fileName || "Nog geen bestand gekozen"}</span>
          </div>

          <div className="actions">
            <label className="btn-outline file-button">
              {loading ? "Bezig..." : "Kies bestand…"}
              <input
                type="file"
                accept=".stl,.obj,model/stl,model/obj,application/octet-stream"
                onChange={handleUpload}
                disabled={loading}
              />
            </label>
          </div>
        </div>

        <div className="card estimate-card">
          <h3>Schatting</h3>
          {estimate ? (
            <ul className="estimate-list">
              <li><span className="icon">🕒</span><span>{estimate.timeMinutes} minuten</span></li>
              <li><span className="icon">💶</span><span>€ {estimate.priceEur}</span></li>
            </ul>
          ) : (
            <p style={{ opacity: 0.7 }}>Nog geen gegevens</p>
          )}
        </div>
      </div>
    </section>
  );
}
