import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <h2>
            <span className="logo-main">PrintHub</span>{" "}
            <span className="logo-sub">Purmerend</span>
          </h2>
          <p>Gemeentelijke 3D-printservice — eenvoudig en lokaal.</p>
        </div>

        <div className="footer-links">
          <a href="#">Over ons</a>
          <a href="#">Contact</a>
          <a href="#">Privacybeleid</a>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PrintHub Purmerend</p>
          <p>
            Ontworpen door <strong>Anass El Boutaheri "samuraicoder"</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};