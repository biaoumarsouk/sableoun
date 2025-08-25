/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/AProposPage.jsx          */
/* =================================================================== */

import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

// Optionnel : vous pouvez ajouter une image représentative
//import aboutImage from '../assets/about-us-image.jpg'; // Assurez-vous d'avoir une image dans src/assets
const aboutImage = "https://placehold.co/600x400/007BFF/FFFFFF?text=Sabléoun";

export default function AProposPage() {
  return (
    <div className=" mt-5">
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <h1 className="display-4 fw-bold">Notre Histoire</h1>
            <p className="lead text-muted">
              Sabléoun est né d'une passion pour le local, l'authentique et le savoir-faire. Notre mission est de créer un pont direct entre les créateurs, producteurs et experts passionnés et les clients à la recherche de qualité et d'originalité.
            </p>
            <p>
              Nous croyons en une économie plus juste et plus humaine. Chaque produit, service ou formation que vous trouverez ici raconte une histoire, celle d'un entrepreneur local qui met tout son cœur dans son travail. En choisissant Sabléoun, vous ne faites pas qu'acheter, vous soutenez un rêve.
            </p>
          </Col>
          <Col md={6}>
            <Image src={aboutImage} rounded fluid shadow-lg />
          </Col>
        </Row>
        
        <hr className="my-5" />

        <div className="text-center">
          <h2 className="fw-bold">Nos Valeurs</h2>
          <Row className="mt-4">
            <Col md={4} className="mb-3">
              <h4 className="text-primary">Authenticité</h4>
              <p>Nous privilégions le fait-main, le local et les produits qui ont une âme.</p>
            </Col>
            <Col md={4} className="mb-3">
              <h4 className="text-primary">Communauté</h4>
              <p>Nous sommes plus qu'une plateforme, nous sommes un réseau de soutien pour les entrepreneurs.</p>
            </Col>
            <Col md={4} className="mb-3">
              <h4 className="text-primary">Simplicité</h4>
              <p>Une expérience d'achat et de vente fluide, directe et sans intermédiaire inutile.</p>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}