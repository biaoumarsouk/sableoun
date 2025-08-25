// Fichier: ~/ecommerce/frontend/src/pages/dashboard/MessageListPage.jsx (Nouveau)

import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { BoxSeam, MegaphoneFill } from 'react-bootstrap-icons'; // <-- Pour les icônes
import './MessageListPage.css';
import apiClient from '../../api/axiosConfig';

export default function MessageListPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiClient.get('/user/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
      } catch (err) {
        setError('Impossible de charger les messages.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMessages();
  }, [token]);

  // --- NOUVELLE FONCTION POUR AFFICHER LE CONTENU CONCERNÉ ---
  const renderConcern = (message) => {
    if (message.product) {
      return (
        <span className="d-flex align-items-center">
          <BoxSeam className="me-2 text-muted flex-shrink-0" />
          <span>{message.product.name}</span>
        </span>
      );
    }
    if (message.affiche) {
      return (
        <span className="d-flex align-items-center">
          <MegaphoneFill className="me-2 text-muted flex-shrink-0" />
          <span>{message.affiche.title}</span>
        </span>
      );
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="shadow-sm border-0">
      <Card.Header as="h5" className="bg-white">Boîte de réception</Card.Header>
      <Card.Body>
        {messages.length > 0 ? (
          <Table hover responsive className="align-middle message-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Statut</th>
                <th style={{ width: '20%' }}>Expéditeur</th>
                <th>Sujet</th>
                <th style={{ width: '25%' }}>Concerne</th> {/* <-- COLONNE RENOMMÉE */}
                <th style={{ width: '15%' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(message => (
                <tr 
                  key={message.id} 
                  onClick={() => navigate(`/dashboard/messages/${message.id}`)}
                  className={!message.is_read ? 'message-unread' : ''}
                >
                  <td>
                    {/* --- LOGIQUE DE STATUT MISE À JOUR --- */}
                    {message.is_read ? (
                      <Badge pill bg="light" text="dark" className="fw-normal">Ouvert</Badge>
                    ) : (
                      <Badge pill bg="primary">Nouveau</Badge>
                    )}
                  </td>
                  <td>{message.sender_name}</td>
                  <td>{message.message.substring(0, 40)}...</td>
                  <td>
                    {/* --- On appelle notre nouvelle fonction --- */}
                    {renderConcern(message)}
                  </td>
                  <td>{format(new Date(message.created_at), 'd MMM yyyy', { locale: fr })}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center p-5">
            <h4 className="text-muted">Boîte de réception vide</h4>
            <p>Lorsqu'un client vous contactera via votre boutique, son message apparaîtra ici.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}