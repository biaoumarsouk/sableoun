// Fichier: ~/ecommerce/frontend/src/components/SellerListItem.jsx
import React from 'react';
import { Card, Button, Badge, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BoxSeam, PersonCircle, GeoAltFill } from 'react-bootstrap-icons'; // <-- On importe GeoAltFill
import { getImageUrl } from '../utils/urlHelpers';

export default function SellerListItem({ seller }) {
  const imageUrl = seller.profile_photo_path ? getImageUrl(seller.profile_photo_path) : null;

  return (
    <Card className="mb-3 shadow-sm seller-list-item">
      <Card.Body className="d-flex align-items-center">
        {imageUrl ? (
          <Image src={imageUrl} roundedCircle style={{width: '80px', height: '80px', objectFit: 'cover'}} className="me-4" />
        ) : (
          <PersonCircle size={80} className="text-secondary me-4" />
        )}
        
        <div className="flex-grow-1">
          <Card.Title as="h5" className="fw-bold mb-1">{seller.company_name || seller.name}</Card.Title>
          <div className="d-flex align-items-center mb-2">
            <span className="text-muted small">{seller.category}</span>
          </div>
          
          {/* --- AJOUT DE LA LOCALISATION --- */}
          {seller.region && seller.country && (
            <p className="text-muted small mb-2 d-flex align-items-center">
              <GeoAltFill className="me-2" />
              {seller.region}, {seller.country}
            </p>
          )}

          <p className="text-muted small mb-0 d-flex align-items-center">
            <BoxSeam className="me-2" />
            {seller.products_count} produits
          </p>
        </div>

        <Button as={Link} to={`/vendeur/${seller.slug}`} variant="outline-primary" className="ms-auto">
          Visiter
        </Button>
      </Card.Body>
    </Card>
  );
}