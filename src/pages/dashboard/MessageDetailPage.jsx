// Fichier: ~/ecommerce/frontend/src/pages/dashboard/MessageDetailPage.jsx (Final)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Row, Col, Button, Image } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
// On importe MegaphoneFill pour la carte de l'affiche
import { ArrowLeft, Reply, PersonCircle, BoxSeam, MegaphoneFill } from 'react-bootstrap-icons';
import apiClient from '../../api/axiosConfig';
import { getImageUrl } from '../../utils/urlHelpers';

export default function MessageDetailPage() {
  const { messageId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await apiClient.get(`/user/messages/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data);
      } catch (err) {
        setError('Impossible de charger ce message. Vous n\'avez peut-être pas les droits.');
      } finally {
        setLoading(false);
      }
    };
    if (token && messageId) fetchMessage();
  }, [token, messageId]);

  if (loading) return <div className="text-center py-5"><Spinner /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!message) return <Alert variant="warning">Message non trouvé.</Alert>;

  return (
    <Container className="py-4">
      <Row>
        {/* Colonne principale avec le message */}
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white">
              <div>
                <h5 className="mb-0">Message de {message.sender_name}</h5>
                <small className="text-muted">
                  Reçu le {format(new Date(message.created_at), 'd MMMM yyyy \'à\' HH:mm', { locale: fr })}
                </small>
              </div>
            </Card.Header>
            <Card.Body className="p-4" style={{ whiteSpace: 'pre-wrap', minHeight: '300px' }}>
              {message.message}
            </Card.Body>
          </Card>
        </Col>

        {/* Colonne latérale avec les infos de contact et du contenu concerné */}
        <Col lg={4} className="mt-4 mt-lg-0">
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header><PersonCircle className="me-2" /> Informations client</Card.Header>
            <Card.Body>
              <p><strong>Nom :</strong> {message.sender_name}</p>
              <p className="mb-0"><strong>Email :</strong> {message.sender_email}</p>
              <Button href={`mailto:${message.sender_email}`} variant="primary" className="mt-3 w-100">
                <Reply className="me-2" /> Répondre par E-mail
              </Button>
            </Card.Body>
          </Card>

          {/* --- LOGIQUE D'AFFICHAGE CONDITIONNEL --- */}

          {/* Cas 1 : Le message concerne un PRODUIT */}
          {message.product && (
            <Card className="shadow-sm border-0">
                <Card.Header><BoxSeam className="me-2" /> Produit concerné</Card.Header>
                <Card.Body>
                <Link to={`/produit/${message.product.id}`} target="_blank" className="text-decoration-none">
                    <Image 
                      src={getImageUrl(message.product.image_path)} 
                      alt={`Image de ${message.product.name}`}
                      className="img-fluid rounded mb-3"
                    />
                </Link>
                <h6 className="fw-bold mb-1">
                    <Link to={`/produit/${message.product.id}`} target="_blank" className="text-dark text-decoration-none">
                      {message.product.name}
                    </Link>
                </h6>
                <p className="text-muted mb-0">
                    Prix : <strong>{message.product.price ? `${parseFloat(message.product.price).toLocaleString('fr-FR')} ${user?.currency}` : 'N/A'}</strong>
                </p>
                </Card.Body>
            </Card>
          )}

          {/* Cas 2 : Le message concerne une AFFICHE */}
          {message.affiche && (
            <Card className="shadow-sm border-0">
                <Card.Header><MegaphoneFill className="me-2" /> Affiche concernée</Card.Header>
                <Card.Body>
                <Link to={`/affiche/${message.affiche.id}`} target="_blank" className="text-decoration-none">
                    <Image 
                      src={getImageUrl(message.affiche.image_path)} 
                      alt={`Image de ${message.affiche.title}`}
                      className="img-fluid rounded mb-3"
                    />
                </Link>
                <h6 className="fw-bold mb-1">
                    <Link to={`/affiche/${message.affiche.id}`} target="_blank" className="text-dark text-decoration-none">
                      {message.affiche.title}
                    </Link>
                </h6>
                {/* Une affiche n'a pas de prix, donc on n'affiche rien de plus */}
                </Card.Body>
            </Card>
          )}

        </Col>
      </Row>
    </Container>
  );
}