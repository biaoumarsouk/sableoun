/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/Dashboard.jsx (Final)      */
/* =================================================================== */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, InputGroup, Form, Table, Image, Modal, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig'; // On importe notre instance axios configurée
import { getImageUrl } from '../utils/urlHelpers'; // On importe le helper pour les images
import toast from 'react-hot-toast';

import { 
  BoxSeam, ChatDotsFill, PlusCircleFill, Clipboard, Check2All, 
  MegaphoneFill, PencilSquare, Trash, ExclamationTriangleFill 
} from 'react-bootstrap-icons';

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [latestProducts, setLatestProducts] = useState([]);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    totalAffiches: 0,
    activeAffiches: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });

  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [productsResponse, affichesResponse, messagesResponse] = await Promise.all([
          apiClient.get('/user/products'),
          apiClient.get('/user/affiches'),
          apiClient.get('/user/messages')
        ]);

        const allProducts = productsResponse.data;
        const allAffiches = affichesResponse.data;
        const allMessages = messagesResponse.data;
        
        const publishedProductsCount = allProducts.filter(p => p.status === 'published').length;
        
        const today = new Date(); today.setHours(0,0,0,0);
        const activeAffichesCount = allAffiches.filter(a => {
            const isPublished = a.status === 'published';
            const startDate = a.start_date ? new Date(a.start_date) : null;
            const endDate = a.end_date ? new Date(a.end_date) : null;
            const isStarted = !startDate || startDate <= today;
            const isNotExpired = !endDate || endDate >= today;
            return isPublished && isStarted && isNotExpired;
        }).length;

        const unreadMessagesCount = allMessages.filter(m => !m.is_read).length;

        setStats({
          totalProducts: allProducts.length,
          publishedProducts: publishedProductsCount,
          totalAffiches: allAffiches.length,
          activeAffiches: activeAffichesCount,
          totalMessages: allMessages.length,
          unreadMessages: unreadMessagesCount,
        });

        setLatestProducts(allProducts.slice(0, 5));

      } catch (error) {
        toast.error("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  const handleShowDeleteModal = (product) => { setProductToDelete(product); setShowDeleteModal(true); };
  const handleCloseDeleteModal = () => { setProductToDelete(null); setShowDeleteModal(false); };
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading('Suppression en cours...');
    try {
      await apiClient.delete(`/products/delete/${productToDelete.id}`);
      setLatestProducts(current => current.filter(p => p.id !== productToDelete.id));
      setStats(prev => ({...prev, totalProducts: prev.totalProducts - 1, publishedProducts: productToDelete.status === 'published' ? prev.publishedProducts - 1 : prev.publishedProducts}));
      toast.success('Produit supprimé !', { id: toastId });
      handleCloseDeleteModal();
    } catch (err) { 
      toast.error('Erreur lors de la suppression.', { id: toastId });
    } finally { 
      setIsDeleting(false); 
    }
  };

  const profileUrl = `${window.location.origin}/vendeur/${user?.slug}`;
  const copyToClipboard = () => { navigator.clipboard.writeText(profileUrl).then(() => { toast.success('Lien copié !'); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }); };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><Spinner /></div>;

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
        <div><h1 className="h2 fw-bold">Vue d'ensemble</h1><p className="text-muted">Bienvenue, {user?.name}.</p></div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Button as={Link} to="/dashboard/affiches/nouvelle" variant="outline-primary" size="lg" className="fw-bold"><MegaphoneFill className="me-2" />Créer une affiche</Button>
          <Button as={Link} to="/dashboard/produits/nouveau" size="lg" className="fw-bold"><PlusCircleFill className="me-2" />Ajouter un produit</Button>
        </div>
      </div>
      
      <Card className="shadow-sm border-0 mb-5">
        <Card.Body className="p-4">
          <Card.Title as="h5">Votre Lien de Boutique</Card.Title>
          <Card.Text className="text-muted small mb-3">Partagez ce lien pour amener des clients vers votre page.</Card.Text>
          <InputGroup>
            <Form.Control value={profileUrl} readOnly />
            <Button variant="outline-primary" onClick={copyToClipboard}>
              {isCopied ? <><Check2All/> Copié</> : <><Clipboard/> Copier</>}
            </Button>
          </InputGroup>
        </Card.Body>
      </Card>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <div className="p-3 bg-primary bg-opacity-10 rounded-circle me-3"><BoxSeam size={24} className="text-primary" /></div>
                <h5 className="mb-0">Produits</h5>
              </div>
              <p className="mb-1 display-6 fw-bold">{stats.publishedProducts}<span className="fs-5 text-muted fw-normal"> / {stats.totalProducts}</span></p>
              <p className="text-muted small mb-0">Produits publiés / Total enregistrés</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <div className="p-3 bg-info bg-opacity-10 rounded-circle me-3"><MegaphoneFill size={24} className="text-info" /></div>
                <h5 className="mb-0">Affiches</h5>
              </div>
              <p className="mb-1 display-6 fw-bold">{stats.activeAffiches}<span className="fs-5 text-muted fw-normal"> / {stats.totalAffiches}</span></p>
              <p className="text-muted small mb-0">Affiches actives / Total enregistrées</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Link to="/dashboard/messages" className="text-decoration-none">
            <Card className="shadow-sm border-0 h-100 card-stat-hover">
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <div className="p-3 bg-success bg-opacity-10 rounded-circle me-3"><ChatDotsFill size={24} className="text-success" /></div>
                  <h5 className="mb-0">Messages</h5>
                </div>
                <p className="mb-1 display-6 fw-bold">{stats.unreadMessages}<span className="fs-5 text-muted fw-normal"> / {stats.totalMessages}</span></p>
                <p className="text-muted small mb-0">Messages non lus / Total reçus</p>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      <div className="mt-4">
        <Card className="shadow-sm border-0">
            <Card.Header as="h5" className="bg-white d-flex justify-content-between align-items-center">
              Vos derniers produits
              <Button as={Link} to="/dashboard/produits" variant="link" size="sm">Voir tout</Button>
            </Card.Header>
            <Card.Body>
                {latestProducts.length > 0 ? (
                  <Table striped hover responsive className="align-middle">
                    <thead><tr><th>Image</th><th>Nom</th><th>Prix</th><th>Statut</th><th className="text-center">Actions</th></tr></thead>
                    <tbody>
                      {latestProducts.map(product => (
                        <tr key={product.id}>
                          <td><Image src={getImageUrl(product.image_path)} alt={product.name} rounded style={{width: '50px', height: '50px', objectFit: 'cover'}} /></td>
                          <td>{product.name}</td>
                          <td>{product.price ? parseFloat(product.price).toLocaleString('fr-FR') + ` ${user?.currency}` : 'N/A'}</td>
                          <td>
                            {product.status === 'published' 
                              ? <Badge bg="success">Publié</Badge> 
                              : <Badge bg="secondary">Brouillon</Badge>
                            }
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                                <Button as={Link} to={`/dashboard/produits/modifier/${product.id}`} variant="outline-primary" size="sm" title="Modifier"><PencilSquare /></Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleShowDeleteModal(product)} title="Supprimer"><Trash /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center text-muted p-3">Vous n'avez encore aucun produit.</p>
                )}
            </Card.Body>
        </Card>
      </div>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton><Modal.Title><ExclamationTriangleFill className="text-danger me-2" /> Confirmation</Modal.Title></Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer <strong>"{productToDelete?.name}"</strong> ?<br/>Cette action est irréversible.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={isDeleting}>Annuler</Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleting}>{isDeleting ? <Spinner as="span" size="sm" /> : "Supprimer"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}