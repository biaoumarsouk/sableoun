/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/dashboard/ProductCreatePage.jsx (Corrigé) */
/* =================================================================== */

import React, { useState } from 'react';
// --- LA CORRECTION EST SUR LA LIGNE SUIVANTE ---
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../api/axiosConfig';

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'draft', // <-- On initialise le statut à 'draft' (brouillon)
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
        // Gestion spéciale pour l'interrupteur
        if (e.target.name === 'status') {
            setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Si aucun fichier n'est sélectionné, on ne fait rien
    if (!file) {
      setImageFile(null);
      return;
    }

    // --- LA VALIDATION DE LA TAILLE EST ICI ---
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 Mo

    if (file.size > maxSizeInBytes) {
      // Si le fichier est trop gros :
      // 1. On affiche un toast d'erreur clair
      toast.error('Le fichier est trop volumineux. La taille maximale est de 2 Mo.');
      
      // 2. On vide le champ de fichier pour que l'utilisateur ne puisse pas l'envoyer
      e.target.value = null; 
      
      // 3. On s'assure que notre état d'image est vide
      setImageFile(null);
      return; // On arrête la fonction ici
    }
    
    // Si la taille est correcte, on met à jour l'état
    setImageFile(file);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('status', formData.status); // <-- On envoie le statut
    if (imageFile) {
      data.append('image', imageFile);
    }

    const toastId = toast.loading('Ajout du produit en cours...');

    try {
      await apiClient.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Produit ajouté avec succès !', { id: toastId });
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        toast.error('Veuillez corriger les erreurs dans le formulaire.', { id: toastId });
      } else {
        toast.error('Une erreur est survenue.', { id: toastId });
      }
      console.error(error);
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
                <Card.Title as="h2" className="text-center mb-4">Ajouter un nouveau produit</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="productName">
                    <Form.Label>Nom du produit *</Form.Label>
                    <Form.Control type="text" name="name" onChange={handleChange} isInvalid={!!errors.name} required />
                    <Form.Control.Feedback type="invalid">{errors.name && errors.name[0]}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="productDescription">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control as="textarea" rows={5} name="description" onChange={handleChange} isInvalid={!!errors.description} required />
                    <Form.Control.Feedback type="invalid">{errors.description && errors.description[0]}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="productPrice">
                    <Form.Label>Prix (en {user?.currency || '...'}) *</Form.Label>
                    <Form.Control type="number" step="0.01" name="price" onChange={handleChange} isInvalid={!!errors.price} required />
                    <Form.Control.Feedback type="invalid">{errors.price && errors.price[0]}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="productImage">
                    <Form.Label>Image du produit *</Form.Label>
                    <Form.Control 
                      type="file" 
                      name="image" 
                      onChange={handleImageChange} 
                      isInvalid={!!errors.image} 
                      required 
                    />
                    
                    {/* --- ON AJOUTE CE BLOC D'INFORMATION --- */}
                    <Form.Text className="text-muted">
                      Taille maximale : 2 Mo. Formats acceptés : JPG, PNG, GIF, WEBP.
                    </Form.Text>

                    <Form.Control.Feedback type="invalid">
                      {errors.image && errors.image[0]}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Check 
                          type="switch"
                          id="product-status-switch"
                          name="status"
                          label="Publier ce produit immédiatement"
                          checked={formData.status === 'published'}
                          onChange={handleChange}
                      />
                      <Form.Text className="text-muted">
                          Si désactivé, le produit sera enregistré comme brouillon et ne sera pas visible par les clients.
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg" disabled={isLoading}>
                      {isLoading ? <Spinner as="span" animation="border" size="sm" /> : "Publier le produit"}
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