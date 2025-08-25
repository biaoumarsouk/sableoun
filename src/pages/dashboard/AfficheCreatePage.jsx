/* =================================================================== */
/* Fichier: ~/ecommerce/frontend/src/pages/dashboard/AfficheCreatePage.jsx */
/* =================================================================== */

import React, { useState } from 'react';
import { Container, Card, Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../api/axiosConfig';

export default function AfficheCreatePage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  // État pour les champs de texte et de date
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',
    start_date: '',
    end_date: '',
  });

  // --- CORRECTION 1 : On crée un état booléen séparé pour l'interrupteur ---
  const [isPublished, setIsPublished] = useState(false); 
  
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handler pour les champs texte et date (ne gère plus le switch)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };  

  // --- CORRECTION 2 : On crée une fonction dédiée pour l'interrupteur ---
  const handleStatusChange = (e) => {
    setIsPublished(e.target.checked);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeInBytes = 2 * 1024 * 1024; // 2 Mo
      if (file.size > maxSizeInBytes) {
        toast.error('Le fichier est trop volumineux. La taille maximale est de 2 Mo.');
        e.target.value = null;
        setImageFile(null);
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('start_date', formData.start_date);
    data.append('end_date', formData.end_date);
    // --- CORRECTION 3 : On envoie la bonne valeur au backend ---
    data.append('status', isPublished ? 'published' : 'draft');
    if (imageFile) {
      data.append('image', imageFile);
    }

    const toastId = toast.loading("Création de l'affiche en cours...");
    try {
      await apiClient.post('/affiches', data, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      toast.success("Affiche créée avec succès !", { id: toastId });
      navigate('/dashboard/affiches');
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error('Veuillez corriger les erreurs dans le formulaire.', { id: toastId });
      } else {
        toast.error('Une erreur est survenue.', { id: toastId });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-sm-5">
                <h2 className="text-center mb-4">Créer une nouvelle Affiche</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="afficheTitle">
                    <Form.Label>Titre de l'affiche *</Form.Label>
                    <Form.Control type="text" name="title" onChange={handleChange} isInvalid={!!errors.title} required />
                    <Form.Control.Feedback type="invalid">{errors.title?.[0]}</Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="afficheDescription">
                    <Form.Label>Description (optionnel)</Form.Label>
                    <Form.Control as="textarea" rows={3} name="description" onChange={handleChange} isInvalid={!!errors.description} />
                    <Form.Control.Feedback type="invalid">{errors.description?.[0]}</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="afficheStartDate">
                        <Form.Label>Date de début (optionnel)</Form.Label>
                        <Form.Control type="date" name="start_date" onChange={handleChange} isInvalid={!!errors.start_date} />
                        <Form.Control.Feedback type="invalid">{errors.start_date?.[0]}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="afficheEndDate">
                        <Form.Label>Date de fin (optionnel)</Form.Label>
                        <Form.Control type="date" name="end_date" onChange={handleChange} isInvalid={!!errors.end_date} />
                        <Form.Control.Feedback type="invalid">{errors.end_date?.[0]}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4" controlId="afficheImage">
                    <Form.Label>Image de l'affiche *</Form.Label>
                    <Form.Control type="file" name="image" onChange={handleImageChange} isInvalid={!!errors.image} required />
                    <Form.Text className="text-muted">Taille max: 2Mo.</Form.Text>
                    <Form.Control.Feedback type="invalid">{errors.image?.[0]}</Form.Control.Feedback>
                  </Form.Group>

                  {/* --- CORRECTION 4 : On lie l'interrupteur au nouvel état et à la nouvelle fonction --- */}
                  <Form.Group className="mb-4">
                      <Form.Check 
                          type="switch"
                          id="affiche-status-switch"
                          label="Publier cette affiche immédiatement"
                          checked={isPublished}
                          onChange={handleStatusChange}
                      />
                      <Form.Text className="text-muted">
                          Si désactivé, l'affiche sera enregistrée comme brouillon.
                      </Form.Text>
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg" disabled={isLoading}>
                      {isLoading ? <Spinner as="span" animation="border" size="sm" /> : "Publier l'affiche"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
}