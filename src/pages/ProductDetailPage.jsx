/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/ProductDetailPage.jsx (Final) */
/* =================================================================== */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// --- On importe Modal et Form ---
import { Container, Row, Col, Image, Card, Button, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Whatsapp, Envelope, ChatDotsFill } from 'react-bootstrap-icons'; // <-- On ajoute ChatDotsFill
import toast from 'react-hot-toast'; // <-- On importe toast pour les notifications
import ProductCarousel from '../components/ProductCarousel';
import SellerInfoCard from '../components/SellerInfoCard';
import './ProductDetailPage.css';
import apiClient from '../api/axiosConfig';
import { getImageUrl } from '../utils/urlHelpers';


const TRUNCATE_LENGTH = 250;
export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTruncated, setIsTruncated] = useState(true);

  // --- NOUVEAUX ÉTATS POUR LA MESSAGERIE ---
  const [showModal, setShowModal] = useState(false);
  const [messageData, setMessageData] = useState({ sender_name: '', sender_email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [messageErrors, setMessageErrors] = useState({});

  const handleClose = () => { setShowModal(false); setMessageErrors({}); };
  const handleShow = () => setShowModal(true);

  const handleMessageChange = (e) => {
    setMessageData({ ...messageData, [e.target.name]: e.target.value });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessageErrors({});
    const toastId = toast.loading('Envoi du message...');

    try {
      await apiClient.post('/messages', {
        ...messageData,
        seller_id: product.user.id,
        product_id: product.id,
      });
      toast.success('Message envoyé avec succès !', { id: toastId });
      handleClose(); // Ferme la modale
      setMessageData({ sender_name: '', sender_email: '', message: '' }); // Vide le formulaire
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setMessageErrors(err.response.data.errors);
        toast.error('Veuillez corriger les erreurs.', { id: toastId });
      } else {
        toast.error("Erreur lors de l'envoi du message.", { id: toastId });
      }
    } finally {
      setIsSending(false);
    }
  };
  // --- FIN DE LA LOGIQUE MESSAGERIE ---

  useEffect(() => {
    // ... (le reste du useEffect ne change pas)
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const productResponse = await apiClient.get(`/products/${id}`);
        setProduct(productResponse.data);
        const allProductsResponse = await apiClient.get('/products');
        const otherProducts = allProductsResponse.data.filter(p => p.user.id === productResponse.data.user.id && p.id !== productResponse.data.id).slice(0, 8);
        setSellerProducts(otherProducts);
      } catch (err) {
        setError('Impossible de trouver ce produit.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) return <div className="text-center py-5 vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!product) return <Container className="py-5"><Alert variant="warning">Aucun produit à afficher.</Alert></Container>;

  const whatsappMessage = encodeURIComponent(`Bonjour, je suis intéressé par votre produit "${product.name}" sur Sabléoun.`);
  const whatsappUrl = `https://wa.me/${product.user.phone_indicator}${product.user.phone}?text=${whatsappMessage}`;
  const emailSubject = encodeURIComponent(`Intérêt pour le produit : ${product.name}`);
  const emailUrl = `mailto:${product.user.email}?subject=${emailSubject}`;
  const imageUrl = product.image_path ? getImageUrl(product.image_path) : 'https://via.placeholder.com/800x600';
  const description = product.description || '';
  const canBeTruncated = description.length > TRUNCATE_LENGTH;
  const displayedDescription = isTruncated ? `${description.substring(0, TRUNCATE_LENGTH)}...` : description;
  const toggleTruncate = () => setIsTruncated(!isTruncated);

  return (
    <>
      <div className="bg-light mt-5">
        <Container className="py-5">
          <div className="p-5 bg-white rounded shadow-sm mb-5 fade-in-up">
            <Row>
              <Col lg={7} className="mb-4 mb-lg-0"><div className="product-image-container"><Image src={imageUrl} className="product-image" /></div></Col>
              <Col lg={5} className="d-flex flex-column">
                {product.user.category && <Badge pill bg="secondary" className="fw-bold mb-2 align-self-start">{product.user.category}</Badge>}
                <h1 className="display-5 fw-bold">{product.name}</h1>
                <div className="mt-3"><p className="lead" style={{whiteSpace: 'pre-wrap'}}>{canBeTruncated ? displayedDescription : description}</p>{canBeTruncated && <Button variant="link" onClick={toggleTruncate} className="p-0">{isTruncated ? 'Lire plus' : 'Voir moins'}</Button>}</div>
                <div className="mt-auto">
                  <hr className="my-4" />
                  <div className="d-flex justify-content-between align-items-center mb-4"><span className="text-muted">Prix</span><span className="fs-2 fw-bolder text-dark">{product.price ? parseFloat(product.price).toLocaleString('fr-FR') + ` ${product.user.currency}` : 'Sur demande'}</span></div>
                  <h5 className="mb-3">Contacter le vendeur</h5>
                  <div className="d-grid gap-2">
                    {/* --- AJOUT DU TROISIÈME BOUTON --- */}
                    <Button variant="primary" size="lg" onClick={handleShow}><ChatDotsFill className="me-2" />Par Sabléoun</Button>
                    {product.user.phone && <Button href={whatsappUrl} target="_blank" variant="success" size="lg"><Whatsapp className="me-2" />Par WhatsApp</Button>}
                    <Button href={emailUrl} variant="outline-dark" size="lg"><Envelope className="me-2" />Par E-mail</Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="fade-in-up" style={{animationDelay: '0.2s'}}><SellerInfoCard seller={product.user} /></div>
        </Container>
        {sellerProducts.length > 0 && <div className="py-5 border-top fade-in-up" style={{animationDelay: '0.4s'}}><Container fluid><Container><div className="text-center mb-4"><h2 className="fw-bold">Plus d'articles de ce vendeur</h2></div></Container><ProductCarousel products={sellerProducts} /></Container></div>}
      </div>

      {/* --- NOTRE NOUVELLE MODALE DE CONTACT --- */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contacter {product.user.company_name || product.user.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small">Votre message sera envoyé directement au vendeur via la plateforme Sabléoun concernant le produit : <strong>{product.name}</strong>.</p>
          <Form onSubmit={handleSendMessage}>
            <Form.Group className="mb-3">
              <Form.Label>Votre nom</Form.Label>
              <Form.Control type="text" name="sender_name" onChange={handleMessageChange} isInvalid={!!messageErrors.sender_name} required />
              <Form.Control.Feedback type="invalid">{messageErrors.sender_name?.[0]}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Votre e-mail</Form.Label>
              <Form.Control type="email" name="sender_email" onChange={handleMessageChange} isInvalid={!!messageErrors.sender_email} required />
              <Form.Control.Feedback type="invalid">{messageErrors.sender_email?.[0]}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Votre message</Form.Label>
              <Form.Control as="textarea" rows={4} name="message" onChange={handleMessageChange} isInvalid={!!messageErrors.message} required />
              <Form.Control.Feedback type="invalid">{messageErrors.message?.[0]}</Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose} className="me-2" disabled={isSending}>Annuler</Button>
              <Button variant="primary" type="submit" disabled={isSending}>
                {isSending ? <Spinner size="sm" /> : "Envoyer le message"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}