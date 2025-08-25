/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/components/ProductCard.jsx (Corrigé) */
/* =================================================================== */

import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/urlHelpers';
import { GeoAltFill, EyeFill } from 'react-bootstrap-icons';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const imageUrl = product.image_path 
    ? getImageUrl(product.image_path) 
    : 'https://via.placeholder.com/300x200';

  return (
    <Card className="h-100 shadow-sm product-card">
      
      {/* --- Le Ruban Vendeur (Lien n°1) --- */}
      <Link to={`/vendeur/${product.user.slug}`} className="company-ribbon-link">
        <div className="company-ribbon">
          <span>{product.user.company_name || product.user.name}</span>
        </div>
      </Link>

      {/* --- L'image (Lien n°2) --- */}
      <Link to={`/products/${product.id}`} className="product-image-link">
        <div className="overflow-hidden">
          <Card.Img variant="top" src={imageUrl} />
        </div>
      </Link>
      
      <Card.Body className="d-flex flex-column p-3">
        {product.user.category && (
          <p className="text-muted small mb-1">{product.user.category}</p>
        )}

        {/* --- Le titre (Lien n°3) --- */}
        <Card.Title className="card-title mb-2">
          <Link to={`/products/${product.id}`} className="text-decoration-none text-dark stretched-link-custom">
            {product.name}
          </Link>
        </Card.Title>
        
        {product.user.city && product.user.country && (
          <div className="d-flex align-items-center text-muted small mt-auto">
            <GeoAltFill className="me-1" />
            <span>{product.user.city}, {product.user.country}</span>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="fw-bold fs-5 price">
            {parseFloat(product.price) > 0 ? `${parseFloat(product.price).toLocaleString('fr-FR')} ${product.user.currency}` : <Badge bg="info">Annonce</Badge>}
          </span>
          {/* L'icône est maintenant juste décorative */}
          <Link to={`/products/${product.id}`}>
            <div className="btn-view-product">
              <EyeFill size={20} />
            </div>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}