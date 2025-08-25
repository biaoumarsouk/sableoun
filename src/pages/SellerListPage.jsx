/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/SellerListPage.jsx (Recherche Améliorée) */
/* =================================================================== */

import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import SellerCard from '../components/SellerCard';
import SellerListItem from '../components/SellerListItem';
import { Search, Grid3x3GapFill, List } from 'react-bootstrap-icons';
import apiClient from '../api/axiosConfig';

export default function SellerListPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await apiClient.get('/sellers');
        setSellers(response.data);
      } catch (err) { 
        setError('Impossible de charger la liste des vendeurs.');
        console.error("Erreur de chargement des vendeurs:", err);
      }
      finally { setLoading(false); }
    };
    fetchSellers();
  }, []);

  // --- LOGIQUE DE FILTRAGE AMÉLIORÉE ---
  const filteredSellers = useMemo(() => {
    if (!searchTerm.trim()) {
      return sellers;
    }
    const term = searchTerm.toLowerCase().trim();
    return sellers.filter(seller =>
      // Recherche dans les infos de base
      seller.name.toLowerCase().includes(term) ||
      (seller.company_name && seller.company_name.toLowerCase().includes(term)) ||
      (seller.category && seller.category.toLowerCase().includes(term)) ||

      // Recherche dans la localisation
      (seller.country && seller.country.toLowerCase().includes(term)) ||
      (seller.region && seller.region.toLowerCase().includes(term)) ||
      (seller.city && seller.city.toLowerCase().includes(term))
    );
  }, [sellers, searchTerm]);

  return (
    <div className="bg-light">
      <Container fluid className="py-5 mt-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Nos Vendeurs</h1>
          <p className="lead text-muted">Découvrez les créateurs, artisans et experts de notre communauté.</p>
        </div>
        
        <Row className="justify-content-center mb-5 align-items-center">
          <Col md={8} lg={6}>
            <InputGroup size="lg" className="custom-search-group">
              <InputGroup.Text className="bg-white"><Search /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Rechercher par nom, catégorie, ville, pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col xs="auto" className="mt-3 mt-md-0">
            <Button 
              variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'} 
              onClick={() => setViewMode('grid')} 
              className="me-2"
              aria-label="Vue en grille"
            >
              <Grid3x3GapFill />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'primary' : 'outline-secondary'} 
              onClick={() => setViewMode('list')}
              aria-label="Vue en liste"
            >
              <List />
            </Button>
          </Col>
        </Row>

        {loading && <div className="text-center"><Spinner /></div>}
        {error && <Alert variant="danger">{error}</Alert>}
        
        {!loading && !error && (
          <>
            {filteredSellers.length > 0 ? (
              viewMode === 'grid' ? (
                <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
                  {filteredSellers.map(seller => (
                    <Col key={seller.id}><SellerCard seller={seller} /></Col>
                  ))}
                </Row>
              ) : (
                <Row className="justify-content-center">
                  <Col lg={10} xl={8}>
                    {filteredSellers.map(seller => (
                      <SellerListItem key={seller.id} seller={seller} />
                    ))}
                  </Col>
                </Row>
              )
            ) : (
              <p className="text-center text-muted mt-5">
                {searchTerm 
                  ? `Aucun résultat pour "${searchTerm}".`
                  : "Aucun vendeur trouvé pour le moment."
                }
              </p>
            )}
          </>
        )}
      </Container>
    </div>
  );
}