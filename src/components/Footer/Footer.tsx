import React from "react";
import "./Footer.css";

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="shop-name">EVER AGE</div>
          <div className="copyright">© {year} EVER AGE</div>
        </div>

        <div className="footer-right">
          <a className="footer-link" href="mailto:contact@ever-age.shop">
            contact@ever-age.shop
          </a>
          <a
            className="footer-link"
            href="https://www.instagram.com/do_omer_/?next=%2Ffo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;