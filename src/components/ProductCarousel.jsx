// Fichier: ~/ecommerce/frontend/src/components/ProductCarousel.jsx (Corrigé et Flexible)

import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { ArrowRightCircleFill } from 'react-bootstrap-icons';
import './ProductCarousel.css';

const ViewMoreCard = () => (
  <Link to="/decouvrir" className="text-decoration-none h-100 d-block">
    {/* On ajoute les classes flex directement ici pour un centrage parfait */}
    <Card className="h-100 shadow-sm d-flex flex-column align-items-center justify-content-center text-center view-more-card">
      <Card.Body>
        <ArrowRightCircleFill size={40} className="text-primary mb-3" />
        <Card.Title as="h5" className="fw-bold">Voir plus</Card.Title>
        <Card.Text className="text-muted small">
          Explorer la collection
        </Card.Text>
      </Card.Body>
    </Card>
  </Link>
);

// Le composant accepte maintenant "items" (pour la homepage) OU "products" (pour la page découvrir)
export default function ProductCarousel({ items, products }) {
  // On détermine la liste à utiliser
  let displayItems = [];

  if (items) {
    displayItems = items;
  } else if (products) {
    // Si on reçoit "products", on le transforme dans le format attendu
    displayItems = products.map(p => ({ type: 'product', data: p }));
  }

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <div className="product-carousel-container">
      <div className="product-carousel-wrapper">
        <Row className="flex-nowrap gx-3">
          {displayItems.map(item => (
            <Col key={item.data.id} xs={10} sm={7} md={5} lg={4} xl={3} className="carousel-col">
              {item.type === 'product' ? (
                <ProductCard product={item.data} />
              ) : (
                <ViewMoreCard />
              )}
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}