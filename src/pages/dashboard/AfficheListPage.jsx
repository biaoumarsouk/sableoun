/* =================================================================== */
/* Fichier: ~/ecommerce/frontend/src/pages/dashboard/AfficheListPage.jsx */
/* =================================================================== */

import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Table, Image, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { PlusCircleFill, PencilSquare, Trash, ExclamationTriangleFill } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import apiClient from '../../api/axiosConfig';
import { getImageUrl } from '../../utils/urlHelpers';

// Fonction helper pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export default function AfficheListPage() {
  const { token } = useAuth();
  const [affiches, setAffiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [afficheToDelete, setAfficheToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShowDeleteModal = (affiche) => { setAfficheToDelete(affiche); setShowDeleteModal(true); };
  const handleCloseDeleteModal = () => { setAfficheToDelete(null); setShowDeleteModal(false); };

  const handleConfirmDelete = async () => {
    if (!afficheToDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading('Suppression de l\'affiche...');
    try {
      await apiClient.delete(`/delete/${afficheToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAffiches(current => current.filter(a => a.id !== afficheToDelete.id));
      toast.success('Affiche supprimée !', { id: toastId });
      handleCloseDeleteModal();
    } catch (err) {
      toast.error('Erreur lors de la suppression.', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchAffiches = async () => {
      if (!token) return;
      try {
        const response = await apiClient.get('/user/affiches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAffiches(response.data);
      } catch (err) { 
        setError('Impossible de charger vos affiches.');
      }
      finally { setLoading(false); }
    };
    fetchAffiches();
  }, [token]);
  
  if (loading) return <div className="text-center py-5"><Spinner /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <Card className="shadow-sm border-0">
        <Card.Header as="h5" className="bg-white d-flex justify-content-between align-items-center">
          Gestion de vos Affiches
          <Button as={Link} to="/dashboard/affiches/nouvelle">
            <PlusCircleFill className="me-2" />
            Créer une affiche
          </Button>
        </Card.Header>
        <Card.Body>
          {affiches.length > 0 ? (
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th style={{width: '10%'}}>Image</th>
                  <th>Titre</th>
                  {/* --- 1. AJOUT DE LA COLONNE --- */}
                  <th style={{width: '15%'}}>Statut Publication</th>
                  <th style={{width: '15%'}}>Statut Validité</th>
                  <th style={{width: '20%'}}>Période</th>
                  <th className="text-center" style={{width: '15%'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiches.map(affiche => {
                  const today = new Date(); today.setHours(0,0,0,0);
                  const startDate = affiche.start_date ? new Date(affiche.start_date) : null;
                  const endDate = affiche.end_date ? new Date(affiche.end_date) : null;
                  let validityStatus = { text: 'Actif', variant: 'success' };
                  if (startDate && startDate > today) { validityStatus = { text: 'Programmé', variant: 'info' }; }
                  else if (endDate && endDate < today) { validityStatus = { text: 'Expiré', variant: 'secondary' }; }
                  
                  return (
                    <tr key={affiche.id}>
                      <td><Image src={getImageUrl(affiche.image_path)} alt={affiche.title} rounded style={{width: '50px', height: '50px', objectFit: 'cover'}} /></td>
                      <td>{affiche.title}</td>
                      
                      {/* --- 2. AFFICHAGE DU BADGE DE STATUT --- */}
                      <td>
                        {affiche.status === 'published' ? (
                          <Badge bg="success">Publiée</Badge>
                        ) : (
                          <Badge bg="secondary">Brouillon</Badge>
                        )}
                      </td>

                      <td><Badge bg={validityStatus.variant}>{validityStatus.text}</Badge></td>
                      <td>{formatDate(affiche.start_date)} - {formatDate(affiche.end_date)}</td>                         
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button as={Link} to={`/dashboard/affiches/modifier/${affiche.id}`} variant="outline-primary" size="sm" title="Modifier">
                            <PencilSquare />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleShowDeleteModal(affiche)} title="Supprimer">
                            <Trash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted mb-3">Vous n'avez aucune affiche pour le moment.</p>
              <Button as={Link} to="/dashboard/affiches/nouvelle" variant="primary">Créer votre première affiche</Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton><Modal.Title><ExclamationTriangleFill className="text-danger me-2" /> Confirmation</Modal.Title></Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer l'affiche : <strong>"{afficheToDelete?.title}"</strong> ?<br />Cette action est irréversible.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={isDeleting}>Annuler</Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleting}>{isDeleting ? <Spinner size="sm" /> : "Supprimer"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}