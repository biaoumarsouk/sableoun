/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/DecouvrirPage.jsx (Final)  */
/* =================================================================== */

import React, { useState, useEffect, useMemo } from 'react';
import { Container, Spinner, Alert, Form, InputGroup, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import ProductCarousel from '../components/ProductCarousel';
import { Search, PeopleFill } from 'react-bootstrap-icons';
import AfficheCarousel from '../components/AfficheCarousel';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';


// L'ordre d'affichage des catégories de service
const serviceOrder = [
  "Vente de Produits", 
  "Vente de Formations", 
  "Prestation de Services", 
  "Agriculture & Élevage", 
  "Autres"
];

export default function DecouvrirPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [allAffiches, setAllAffiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // On lance les deux appels API en parallèle
        const [productsResponse, affichesResponse] = await Promise.all([
          apiClient.get('/products'),
          apiClient.get('/affiches/public')
        ]);
        
        setAllProducts(productsResponse.data);
        setAllAffiches(affichesResponse.data); // <-- On met à jour la bonne variable
      } catch (err) {
        setError('Impossible de charger le contenu. Veuillez réessayer plus tard.');
        console.error("Erreur de chargement de la page Découvrir:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  // Hook pour filtrer, grouper et trier les produits
  const groupedProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filteredProducts = term
      ? allProducts.filter(product => {
          const nameMatch = product.name.toLowerCase().includes(term);
          const serviceMatch = product.user.main_service && product.user.main_service.toLowerCase().includes(term);
          const categoryMatch = product.user.category && product.user.category.toLowerCase().includes(term);
          const sellerNameMatch = product.user.name.toLowerCase().includes(term);
          const companyNameMatch = product.user.company_name && product.user.company_name.toLowerCase().includes(term);
          const countryMatch = product.user.country && product.user.country.toLowerCase().includes(term);
          const regionMatch = product.user.region && product.user.region.toLowerCase().includes(term);
          const cityMatch = product.user.city && product.user.city.toLowerCase().includes(term);
          return nameMatch || serviceMatch || categoryMatch || sellerNameMatch || companyNameMatch || countryMatch || regionMatch || cityMatch;
        })
      : allProducts;

    const grouped = filteredProducts.reduce((acc, product) => {
      const service = product.user.main_service || 'Autres';
      if (!acc[service]) {
        acc[service] = [];
      }
      acc[service].push(product);
      return acc;
    }, {});
    
    const sortedGroupEntries = Object.entries(grouped).sort(([serviceA], [serviceB]) => {
      const indexA = serviceOrder.indexOf(serviceA);
      const indexB = serviceOrder.indexOf(serviceB);
      return indexA - indexB;
    });

    return sortedGroupEntries;

  }, [allProducts, searchTerm]);


  const filteredAffiches = useMemo(() => {
    if (!searchTerm.trim()) {
      return allAffiches; // Si pas de recherche, on retourne toutes les affiches
    }
    const term = searchTerm.toLowerCase().trim();
    return allAffiches.filter(affiche =>
      affiche.title.toLowerCase().includes(term) ||
      (affiche.description && affiche.description.toLowerCase().includes(term)) ||
      affiche.user.name.toLowerCase().includes(term) ||
      (affiche.user.company_name && affiche.user.company_name.toLowerCase().includes(term)) ||
      (affiche.user.country && affiche.user.country.toLowerCase().includes(term)) ||
      (affiche.user.region && affiche.user.region.toLowerCase().includes(term)) ||
      (affiche.user.city && affiche.user.city.toLowerCase().includes(term))
    );
  }, [allAffiches, searchTerm]);

    // --- AFFICHAGE (JSX) ---
  return (
    <>
      {/* --- SECTION HÉRO AVEC RECHERCHE --- */}
      <div className="bg-light py-5 mt-5">
        <Container>
          <div className="text-center mb-4">
            <h1 className="fw-bold">Découvrir le Marché</h1>
            <p className="lead text-muted">Trouvez des produits, services, formations et vendeurs uniques.</p>
          </div>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <InputGroup size="lg" className="custom-search-group">
                <InputGroup.Text className="bg-white">
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Rechercher par produit, service, catégorie, vendeur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white"
                />
              </InputGroup>
            </Col>
          </Row>
           <div className="text-center mt-4">
              <p className="text-muted mb-2">Ou parcourez directement nos créateurs :</p>
              <Button as={Link} to="/vendeurs" variant="outline-primary">
                <PeopleFill className="me-2" />
                Voir la liste des Vendeurs
              </Button>
            </div>
        </Container>
      </div>

      {/* --- SECTION AFFICHAGE DES RÉSULTATS --- */}
      <Container fluid className="py-5">
        {loading && <div className="text-center"><Spinner animation="border" variant="primary" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}
        
        {!loading && !error && (
          <>
            {/* --- NOUVELLE SECTION D'AFFICHES --- */}
            {/* S'affiche uniquement si la barre de recherche est vide */}
            {filteredAffiches.length > 0 && (
              <div className="mb-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold d-inline-block position-relative">
                    {searchTerm ? `Annonces correspondant à "${searchTerm}"` : "Annonces & Événements"}
                    <span 
                      style={{
                        position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                        width: '60px', height: '3px', backgroundColor: 'var(--bs-primary)'
                      }}
                    ></span>
                  </h2>
                </div>
                <Container fluid>
                  <AfficheCarousel affiches={filteredAffiches} />
                </Container>
                <hr className="my-5" />
              </div>
            )}

            {/* --- SECTION DES PRODUITS --- */}
            {groupedProducts && groupedProducts.length > 0 ? (
              groupedProducts.map(([serviceName, products]) => (
                <div key={serviceName} className="mb-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold d-inline-block position-relative">
                      {serviceName}
                      <span 
                        style={{
                          position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                          width: '60px', height: '3px', backgroundColor: 'var(--bs-primary)'
                        }}
                      ></span>
                    </h2>
                  </div>
                  {/* On utilise un Container fluid pour permettre au carrousel de déborder */}
                  <Container fluid>
                    <ProductCarousel products={products} />
                  </Container>
                </div>
              ))
            ) : (
              <div className="text-center text-muted mt-5">
                <p>
                  {searchTerm 
                    ? `Aucun résultat pour "${searchTerm}".`
                    : "Aucun produit n'a été trouvé pour le moment."
                  }
                </p>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}