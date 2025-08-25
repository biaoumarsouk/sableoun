// Fichier: ~/ecommerce/frontend/src/components/AfficheCarousel.jsx
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import AfficheCard from './AfficheCard';
import './ProductCarousel.css'; // On peut réutiliser le même style de carrousel

export default function AfficheCarousel({ affiches }) {
  if (!affiches || affiches.length === 0) return null;

  return (
    <div className="product-carousel-container">
      <div className="product-carousel-wrapper">
        <Row className="flex-nowrap gx-3">
          {affiches.map(affiche => (
            <Col key={affiche.id}  xs={10} sm={7} md={5} lg={4} xl={3}>
              <AfficheCard affiche={affiche} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}