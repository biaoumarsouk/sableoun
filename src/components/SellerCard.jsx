// Fichier: ~/ecommerce/frontend/src/components/SellerCard.jsx (Modifié)
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BoxSeam, PersonCircle, GeoAltFill } from 'react-bootstrap-icons';
import './SellerCard.css'; // Assurez-vous que ce fichier est importé
import { getImageUrl } from '../utils/urlHelpers';

export default function SellerCard({ seller }) {
  const imageUrl = seller.profile_photo_path ? getImageUrl(seller.profile_photo_path) : null;

  return (
    <Card className="h-100 shadow-sm text-center seller-card">
      <Card.Body className="d-flex flex-column p-4">

        {/* --- CONTENEUR D'AVATAR UNIFIÉ --- */}
        <div className="seller-avatar-container mb-3 mx-auto">
          {imageUrl ? (
            // On utilise une balise <img> standard pour un meilleur contrôle CSS
            <img src={imageUrl} alt={`Profil de ${seller.company_name || seller.name}`} className="seller-profile-image" />
          ) : (
            // L'icône par défaut
            <PersonCircle className="seller-default-icon" />
          )}
        </div>
        
        <Card.Title as="h5" className="fw-bold">{seller.company_name || seller.name}</Card.Title>
        
        {seller.category && <p className="text-muted small mb-2">{seller.category}</p>}

        {seller.region && seller.country && (
          <div className="d-flex justify-content-center align-items-center text-muted small mb-3">
            <GeoAltFill className="me-2" />
            <span>{seller.region}, {seller.country}</span>
          </div>
        )}

        <div className="d-flex justify-content-center align-items-center text-muted mb-3">
          <BoxSeam className="me-2" />
          <span>{seller.products_count} produits</span>
        </div>
        
        <Button as={Link} to={`/vendeur/${seller.slug}`} variant="primary" className="mt-auto stretched-link">
          Visiter la boutique
        </Button>
      </Card.Body>
    </Card>
  );
}