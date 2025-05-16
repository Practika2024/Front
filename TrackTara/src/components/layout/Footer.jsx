import "./layout.css";

const Footer = () => {
  return (
    <footer className="custom-footer shadow-sm">
      <div className="footer-content">
        <div className="footer-brand">Bimba Corporation</div>
        <div className="footer-links">
          <a href="mailto:mosiichuk.oleksandr@oa.edu.ua">mosiichuk.oleksandr@oa.edu.ua</a>
          <span>|</span>
          <a href="tel:+380974227345">+380 97 422 73 45</a>
        </div>
        <div className="footer-copyright">
          © 2025 Copyright
        </div>
      </div>
    </footer>
  );
};

export default Footer;
