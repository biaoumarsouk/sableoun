/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/dashboard/ProductEditPage.jsx (Final) */
/* =================================================================== */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col, Image } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'react-bootstrap-icons';
import apiClient from '../../api/axiosConfig';
import { getImageUrl } from '../../utils/urlHelpers';

export default function ProductEditPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [productData, setProductData] = useState({ name: '', description: '', price: '', status: 'draft' }); 
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialError, setInitialError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/products/edit/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductData(response.data);
        if (response.data.image_path) {
          setImagePreview(getImageUrl(response.data.image_path));
        }
      } catch (err) {
        setInitialError("Impossible de charger les données. Vérifiez que le produit existe et que vous avez les droits.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, token]);

  const handleChange = (e) => {
        if (e.target.name === 'status') {
            setProductData({ ...productData, status: e.target.checked ? 'published' : 'draft' });
        } else {
            setProductData({ ...productData, [e.target.name]: e.target.value });
        }
    };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) { setImageFile(null); return; }
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 Mo
    if (file.size > maxSizeInBytes) {
      toast.error('Le fichier est trop volumineux (max 2 Mo).');
      e.target.value = null;
      setImageFile(null);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    const toastId = toast.loading('Mise à jour du produit...');

    const data = new FormData();
    data.append('name', productData.name);
    data.append('description', productData.description);
    data.append('price', productData.price || '');
    data.append('status', productData.status); 
    if (imageFile) {
      data.append('image', imageFile);
    }
    
    try {
      await apiClient.post(`/products/update/${productId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      toast.success('Produit mis à jour avec succès !', { id: toastId });
      navigate('/dashboard/produits');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        toast.error('Veuillez corriger les erreurs.', { id: toastId });
      } else {
        toast.error('Une erreur est survenue.', { id: toastId });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 72px)' }}><Spinner animation="border" /></div>;
  }
  
  if (initialError) {
    return <Container className="py-5"><Alert variant="danger">{initialError}</Alert></Container>;
  }

  return (
    <div className="bg-light" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-sm-5">
                <Card.Title as="h2" className="text-center mb-4">Modifier le produit</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="productName">
                    <Form.Label>Nom du produit *</Form.Label>
                    <Form.Control type="text" name="name" value={productData.name} onChange={handleChange} isInvalid={!!errors.name} required />
                    <Form.Control.Feedback type="invalid">{errors.name && errors.name[0]}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="productDescription">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control as="textarea" rows={5} name="description" value={productData.description} onChange={handleChange} isInvalid={!!errors.description} required />
                    <Form.Control.Feedback type="invalid">{errors.description && errors.description[0]}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="productPrice">
                    <Form.Label>Prix (en {user?.currency || '...'})</Form.Label>
                    {/* --- LA CORRECTION EST ICI : On enlève 'required' --- */}
                    <Form.Control type="number" step="0.01" name="price" value={productData.price || ''} onChange={handleChange} isInvalid={!!errors.price} />
                    <Form.Control.Feedback type="invalid">{errors.price && errors.price[0]}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="productImage">
                    <Form.Label>Image du produit</Form.Label>
                    {imagePreview && <div className="mb-3 text-center"><Image src={imagePreview} alt="Aperçu" thumbnail style={{ maxHeight: '200px' }}/></div>}
                    {/* --- CORRECTION 2 : On enlève aussi 'required' de l'image pour la modification --- */}
                    <Form.Control type="file" name="image" onChange={handleImageChange} isInvalid={!!errors.image} />
                    <Form.Text className="text-muted">Ne choisissez un fichier que si vous souhaitez remplacer l'image actuelle. (Max 2 Mo)</Form.Text>
                    <Form.Control.Feedback type="invalid">{errors.image && errors.image[0]}</Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Check 
                        type="switch"
                        id="product-status-switch"
                        name="status"
                        label="Produit publié"
                        // --- LA CORRECTION EST ICI ---
                        // On utilise 'productData' et non 'formData'
                        checked={productData.status === 'published'}
                        onChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                        Si activé, ce produit sera visible par les clients sur votre boutique.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg" disabled={submitting}>
                      {submitting ? <Spinner as="span" animation="border" size="sm" /> : "Enregistrer les modifications"}
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