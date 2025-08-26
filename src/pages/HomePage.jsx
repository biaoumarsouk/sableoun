/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/HomePage.jsx (Final)     */
/* =================================================================== */

import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig'; // <-- 1. On importe notre instance axios configurée

// Import des composants réutilisables
import ProductCarousel from '../components/ProductCarousel';
import HeroCarousel from '../components/HeroCarousel';
import AfficheCarousel from '../components/AfficheCarousel';

export default function HomePage() {
  const [affiches, setAffiches] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 2. On utilise notre instance 'apiClient'
        const [productsResponse, affichesResponse] = await Promise.all([
          apiClient.get('/products'),
          apiClient.get('/affiches/public')
        ]);
        
        const allProducts = productsResponse.data;
        // Pour plus de variété, on mélange le tableau avant de le couper
        const shuffledProducts = [...allProducts].sort(() => 0.5 - Math.random());
        
        setLatestProducts(shuffledProducts.slice(0, 8)); // 8 produits pour un carousel plus riche
        setPopularProducts(shuffledProducts.slice(8, 16)); // 8 autres produits différents
        setAffiches(affichesResponse.data);

      } catch (err) {
        setError('Erreur de chargement des données. Veuillez rafraîchir la page.');
        console.error("Erreur de chargement de la page d'accueil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomePageData();
  }, []); // Le tableau vide [] assure que cet effet ne s'exécute qu'une fois.

  // Fonction "helper" pour afficher une section de produits
  const renderProductSection = (title, description, products) => {
    if (products.length === 0 && !loading) {
      return null;
    }

    const carouselItems = [
      ...products.map(p => ({ type: 'product', data: p })),
      { type: 'view-more', data: { id: `view-more-${title.replace(/\s+/g, '-')}` } }
    ];

    return (
      <div className="py-2">
        <div className="text-center mb-5">
          <h2 className="fw-bold">{title}</h2>
          <p className="lead text-muted">{description}</p>
        </div>
        <ProductCarousel items={carouselItems} />
      </div>
    );
  };

  return (
    <>
      <HeroCarousel />

      {/* On utilise un seul Container principal pour le contenu */}
      <Container fluid>
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" style={{width: '3rem', height: '3rem'}} />
          </div>
        )}
        
        {error && (
          <Alert variant="danger" className="my-5">{error}</Alert>
        )}
        
        {!loading && !error && (
          <>
            {/* --- Section des Affiches (mise en avant) --- */}
            {affiches.length > 0 && (
              <div className="py-2">
                <div className="text-center mb-5">
                  <h2 className="fw-bold">Annonces & Événements</h2>
                  <p className="lead text-muted">Les dernières nouvelles de nos vendeurs.</p>
                </div>
                {/* On utilise un Container fluid à l'intérieur pour le carousel */}
                <Container fluid>
                    <AfficheCarousel affiches={affiches} />
                </Container>
              </div>
            )}

            {renderProductSection(
              "Nos Nouveautés", 
              "Les derniers articles ajoutés par nos vendeurs.",
              latestProducts
            )}

            {renderProductSection(
              "Sélection Populaire",
              "Les produits les plus appréciés par notre communauté.",
              popularProducts
            )}
          </>
        )}
      </Container>
      
      {!loading && (
        <div className="bg-light">
          <Container className="text-center">
            <h3 className="fw-bold">Vous avez un talent, un produit ou un savoir-faire à partager ?</h3>
            <p className="lead text-muted my-3">
              Sabléoun est la plateforme idéale pour atteindre de nouveaux clients et développer votre activité, que vous soyez artisan, producteur, formateur ou commerçant.
            </p>
            <Button as={Link} to="/register" variant="primary" size="lg" className="fw-bold">
              Commencez à vendre aujourd'hui
            </Button>
          </Container>
        </div>
      )}
    </>
  );
}