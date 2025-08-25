/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/SellerProfilePage.jsx (Final) */
/* =================================================================== */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { TelephoneFill, PersonCircle, GeoAltFill, Envelope } from 'react-bootstrap-icons'; // <-- AJOUTER GeoAltFill
import ProductCarousel from '../components/ProductCarousel';
import AfficheCarousel from '../components/AfficheCarousel';

// On importe notre CSS personnalisé
import './SellerProfilePage.css';
import apiClient from '../api/axiosConfig';
import { getImageUrl } from '../utils/urlHelpers';

export default function SellerProfilePage() {
  const { slug } = useParams(); // <-- On récupère le "slug" de l'URL
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [affiches, setAffiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sellerResponse, productsResponse, affichesResponse] = await Promise.all([
          apiClient.get(`/sellers/${slug}`),
          apiClient.get(`/sellers/${slug}/products`),
          apiClient.get(`/sellers/${slug}/affiches`)
        ]);
        
        setSeller(sellerResponse.data);
        setProducts(productsResponse.data);
        setAffiches(affichesResponse.data);

      } catch (err) {
        setError('Impossible de trouver ce vendeur.');
        console.error("Erreur de chargement du profil vendeur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerDetails();
  }, [slug]);

  if (loading) { return <div className="text-center py-5 vh-100 d-flex justify-content-center align-items-center"><Spinner /></div>; }
  if (error) { return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>; }
  if (!seller) { return <Container className="py-5"><Alert variant="warning">Vendeur non trouvé.</Alert></Container>; }

  return (
    <>
      {/* --- Section Héro de Présentation --- */}
      <div className="seller-hero mt-5">
        <Container>
          <Row className="align-items-center">
            <Col md={3} className="text-center mb-4 mb-md-0">
              {/* --- LA CORRECTION EST ICI --- */}
              {seller.profile_photo_path ? (
                // Si une photo existe, on l'affiche
                <Image 
                  src={getImageUrl(seller.profile_photo_path)}
                  roundedCircle 
                  className="profile-image shadow" 
                  style={{width: '150px', height: '150px', objectFit: 'cover'}}
                />
              ) : (
                // Sinon, on affiche une icône par défaut
                <PersonCircle size={150} className="text-light profile-image" />
              )}
            </Col>
            <Col md={9} className="text-center text-md-start">
              <Badge pill bg="light" text="dark" className="mb-2 fs-6 fw-normal">{seller.main_service}</Badge>
              <h1 className="display-4 fw-bold">{seller.company_name || seller.name}</h1>
              <p className="lead" style={{opacity: 0.8}}>{seller.category}</p>
              {seller.phone && (
                <p className="mt-3"><TelephoneFill className="me-2"/> {seller.phone}</p>
              )}
              {seller.email && (
                <p className="mt-2 mb-0">
                  <Envelope className="me-2"/>
                  <a href={`mailto:${seller.email}`} className="text-white text-decoration-none">
                    {seller.email}
                  </a>
                </p>
              )}
              {seller.city && seller.country && (
                <p className="mt-2 text-white-50">
                  <GeoAltFill className="me-2"/> 
                  {seller.city}, {seller.region}, {seller.country}
                </p>
              )}
            </Col>
          </Row>
        </Container>
      </div>
      <Container fluid className="py-5">
        {/* --- Section "À propos du vendeur" --- */}
        {seller.services_description && (
          <div className="mb-5 text-center">
            <h2 className="fw-bold mb-4">À propos de nous</h2>
            <p className="mx-auto" style={{maxWidth: '800px'}}>{seller.services_description}</p>
          </div>
        )}

        {/* --- Section des Affiches du Vendeur --- */}
        {affiches.length > 0 && (
          <div className="mb-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Annonces & Événements</h2>
            </div>
            <Container fluid className="px-0">
              <AfficheCarousel affiches={affiches} />
            </Container>
          </div>
        )}

        {/* --- Section des Produits du Vendeur --- */}
        {products.length > 0 && (
          <div className="seller-products-section pt-5 border-top">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Nos Articles</h2>
            </div>
            <Container fluid className="px-0">
              <ProductCarousel products={products} />
            </Container>
          </div>
        )}

        {/* Message si le vendeur n'a rien à montrer */}
        {products.length === 0 && affiches.length === 0 && (
           <p className="text-center text-muted mt-5">Ce vendeur n'a pas encore de contenu en ligne.</p>
        )}
      </Container>
    </>
  );
}