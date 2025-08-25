// Fichier: ~/ecommerce/frontend/src/components/AfficheCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/urlHelpers';

export default function AfficheCard({ affiche }) {
  const imageUrl = getImageUrl(affiche.image_path);

  return (
    <Card className="h-100 shadow border-0 rounded-3 overflow-hidden">
      <Card.Img variant="top" src={imageUrl} style={{ height: '300px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h5" className="fw-bold">{affiche.title}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {affiche.description?.substring(0, 100)}...
        </Card.Text>
        {/* --- CORRECTION DU LIEN --- */}
        <Button as={Link} to={`/affiches/${affiche.id}`} variant="primary" className="mt-auto">
          Voir l'annonce
        </Button>
      </Card.Body>
    </Card>
  );
}