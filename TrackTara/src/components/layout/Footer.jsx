import "./layout.css";

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        <div className="footer-brand">Bimba Corporation</div>
        <div className="footer-links">
          <a href="mailto:andrii.lavreniuk@oa.edu.ua">andrii.lavreniuk@oa.edu.ua</a>
          <span className="separator">·</span>
          <a href="mailto:vitalii.mostovyi@oa.edu.ua">vitalii.mostovyi@oa.edu.ua</a>
          <span className="separator">·</span>
          <a href="tel:+380974227345">+380 97 422 73 45</a>
        </div>
        <div className="footer-copyright">© 2025</div>
      </div>
    </footer>
  );
};

export default Footer;
