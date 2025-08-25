// Fichier: ~/ecommerce/frontend/src/components/SellerInfoCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PersonCircle, ArrowRight } from 'react-bootstrap-icons';

export default function SellerInfoCard({ seller }) {
  return (
    <Link to={`/vendeur/${seller.slug}`} className="text-decoration-none">
      <Card className="seller-info-card shadow-sm border-0">
        <Card.Body className="d-flex align-items-center">
          <PersonCircle size={50} className="text-primary me-4" />
          <div className="flex-grow-1">
            <h5 className="fw-bold mb-1">{seller.company_name || seller.name}</h5>
            <p className="text-muted mb-0">{seller.main_service}</p>
          </div>
          <ArrowRight size={24} className="text-muted arrow-icon" />
        </Card.Body>
      </Card>
    </Link>
  );
}