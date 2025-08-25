/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/AfficheDetailPage.jsx (Final) */
/* =================================================================== */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// --- On importe Modal et Form ---
import { Container, Row, Col, Image, Card, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import SellerInfoCard from '../components/SellerInfoCard';
// --- On importe les icônes nécessaires ---
import { Whatsapp, Envelope, ChatDotsFill } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import './ProductDetailPage.css'; // On réutilise le même style
import { getImageUrl } from '../utils/urlHelpers';
import apiClient from '../api/axiosConfig';

const TRUNCATE_LENGTH = 250;

export default function AfficheDetailPage() {
  const { id } = useParams();
  const [affiche, setAffiche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTruncated, setIsTruncated] = useState(true);

  // --- LOGIQUE DE MESSAGERIE (ADAPTÉE DE PRODUCTDETAILPAGE) ---
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
        seller_id: affiche.user.id,
        affiche_id: affiche.id, // <-- La différence clé : on envoie l'ID de l'affiche
      });
      toast.success('Message envoyé avec succès !', { id: toastId });
      handleClose();
      setMessageData({ sender_name: '', sender_email: '', message: '' });
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setMessageErrors(err.response.data.errors);
        toast.error('Veuillez corriger les erreurs dans le formulaire.', { id: toastId });
      } else {
        toast.error("Erreur lors de l'envoi du message.", { id: toastId });
      }
    } finally {
      setIsSending(false);
    }
  };
  // --- FIN DE LA LOGIQUE MESSAGERIE ---

  useEffect(() => {
    const fetchAfficheDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/affiches/${id}`);
        setAffiche(response.data);
      } catch (err) {
        setError('Impossible de trouver cette annonce.');
      } finally {
        setLoading(false);
      }
    };
    fetchAfficheDetails();
  }, [id]);

  if (loading) { return <div className="text-center py-5 vh-100 d-flex justify-content-center align-items-center"><Spinner /></div>; }
  if (error) { return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>; }
  if (!affiche) { return <Container className="py-5"><Alert variant="warning">Annonce non trouvée.</Alert></Container>; }

  const imageUrl = getImageUrl(affiche.image_path);
  const whatsappMessage = encodeURIComponent(`Bonjour, je vous contacte au sujet de votre annonce "${affiche.title}" vue sur Sabléoun.`);
  const whatsappUrl = `https://wa.me/${affiche.user.phone_indicator}${affiche.user.phone}?text=${whatsappMessage}`;
  const emailSubject = encodeURIComponent(`Réponse à votre annonce : ${affiche.title}`);
  const emailUrl = `mailto:${affiche.user.email}?subject=${emailSubject}`;
  const description = affiche.description || '';
  const canBeTruncated = description.length > TRUNCATE_LENGTH;
  const displayedDescription = isTruncated ? `${description.substring(0, TRUNCATE_LENGTH)}...` : description;
  const toggleTruncate = () => setIsTruncated(!isTruncated);

  return (
    <>
      <div className="bg-light mt-5">
        <Container className="py-5">
          <div className="p-5 bg-white rounded shadow-sm mb-5">
            <Row>
              <Col lg={7} className="mb-4 mb-lg-0">
                <div className="product-image-container"><Image src={imageUrl} className="product-image" /></div>
              </Col>
              <Col lg={5} className="d-flex flex-column">
                <h1 className="display-5 fw-bold">{affiche.title}</h1>
                {description && <div className="mt-3"><p className="lead" style={{whiteSpace: 'pre-wrap'}}>{canBeTruncated ? displayedDescription : description}</p>{canBeTruncated && <Button variant="link" onClick={toggleTruncate} className="p-0">{isTruncated ? 'Lire plus' : 'Voir moins'}</Button>}</div>}
                <div className="mt-auto">
                  <hr className="my-4" />
                  <h5 className="mb-3">Contacter l'annonceur</h5>
                  <div className="d-grid gap-2">
                    {/* --- LE NOUVEAU BOUTON EST ICI --- */}
                    <Button variant="primary" size="lg" onClick={handleShow}><ChatDotsFill className="me-2" />Par Sabléoun</Button>
                    {affiche.user.phone && <Button href={whatsappUrl} target="_blank" variant="success" size="lg"><Whatsapp className="me-2" />Par WhatsApp</Button>}
                    <Button href={emailUrl} variant="outline-dark" size="lg"><Envelope className="me-2" />Par E-mail</Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <SellerInfoCard seller={affiche.user} />
        </Container>
      </div>

      {/* --- LA NOUVELLE MODALE DE CONTACT --- */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contacter {affiche.user.company_name || affiche.user.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small">Votre message sera envoyé au vendeur concernant l'annonce : <strong>{affiche.title}</strong>.</p>
          <Form onSubmit={handleSendMessage}>
            <Form.Group className="mb-3">
              <Form.Label>Votre nom</Form.Label>
              <Form.Control type="text" name="sender_name" value={messageData.sender_name} onChange={handleMessageChange} isInvalid={!!messageErrors.sender_name} required />
              <Form.Control.Feedback type="invalid">{messageErrors.sender_name?.[0]}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Votre e-mail</Form.Label>
              <Form.Control type="email" name="sender_email" value={messageData.sender_email} onChange={handleMessageChange} isInvalid={!!messageErrors.sender_email} required />
              <Form.Control.Feedback type="invalid">{messageErrors.sender_email?.[0]}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Votre message</Form.Label>
              <Form.Control as="textarea" rows={4} name="message" value={messageData.message} onChange={handleMessageChange} isInvalid={!!messageErrors.message} required />
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