/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/components/Footer.jsx          */
/* =================================================================== */

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'react-bootstrap-icons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container bg-dark text-white pt-5 pb-4">
      <Container fluid>
        <Row>
          {/* --- Colonne 1 : À propos de Sabléoun --- */}
          <Col md={4} lg={4} xl={4} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Sabléoun</h5>
            <p>
              La place de marché qui connecte les créateurs, producteurs et experts locaux avec une communauté de clients passionnés. Découvrez l'authenticité, soutenez le local.
            </p>
          </Col>

          {/* --- Colonne 2 : Liens Utiles --- */}
          <Col md={2} lg={2} xl={2} className="mx-auto mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Navigation</h6>
            <p><Link to="/" className="footer-link">Accueil</Link></p>
            <p><Link to="/decouvrir" className="footer-link">Découvrir</Link></p>
            <p><Link to="/a-propos" className="footer-link">À propos</Link></p>
            <p><Link to="/contact" className="footer-link">Contact</Link></p>
          </Col>

          {/* --- Colonne 3 : Espace Vendeur --- */}
          <Col md={3} lg={2} xl={2} className="mx-auto mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Espace Vendeur</h6>
            <p><Link to="/login" className="footer-link">Se connecter</Link></p>
            <p><Link to="/register" className="footer-link">Devenir Vendeur</Link></p>
            <p><Link to="/faq-vendeur" className="footer-link">FAQ Vendeurs</Link></p>
          </Col>

          {/* --- Colonne 4 : Contact & Réseaux Sociaux --- */}
          <Col md={3} lg={3} xl={3} className="mx-auto mb-md-0 mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
            <p>Dakar, Sénégal</p>
            <p>contact@sableoun.com</p>
            <p>+ 221 77 123 45 67</p>
            <div className="social-icons mt-4">
              <a href="#!" className="me-4"><Facebook size={20} /></a>
              <a href="#!" className="me-4"><Twitter size={20} /></a>
              <a href="#!" className="me-4"><Instagram size={20} /></a>
              <a href="#!" className="me-4"><Linkedin size={20} /></a>
            </div>
          </Col>
        </Row>
      </Container>

      {/* --- Ligne de Copyright --- */}
      <hr />
      <div className="text-center  copyright-bar">
        © {new Date().getFullYear()} Sabléoun. Tous droits réservés.
      </div>
    </footer>
  );
}