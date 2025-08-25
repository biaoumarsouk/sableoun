// Fichier: ~/ecommerce/frontend/src/pages/dashboard/AfficheEditPage.jsx (Finalisé)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col, Image } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'react-bootstrap-icons';
import apiClient from '../../api/axiosConfig';

// Helper pour formater la date pour le champ input type="date"
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // La date de l'API est "YYYY-MM-DD HH:MM:SS", on a juste besoin de "YYYY-MM-DD"
    return dateString.split(' ')[0];
};

export default function AfficheEditPage() {
    const { afficheId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    // État pour les champs de texte et de date
    const [afficheData, setAfficheData] = useState({ title: '', description: '', start_date: '', end_date: '' });
    
    // État booléen séparé pour l'interrupteur
    const [isPublished, setIsPublished] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [initialError, setInitialError] = useState(null);

    useEffect(() => {
        const fetchAffiche = async () => {
            try {
                const response = await apiClient.get(`affiches/edit/${afficheId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                setAfficheData({
                    title: data.title || '',
                    description: data.description || '',
                    start_date: formatDateForInput(data.start_date),
                    end_date: formatDateForInput(data.end_date),
                });
                
                // On initialise l'état de l'interrupteur avec la valeur de l'API
                setIsPublished(data.status === 'published');

                if (data.image_path) {
                    setImagePreview(`http://127.0.0.1:8000/storage/${data.image_path}`);
                }
            } catch (err) {
                setInitialError("Impossible de charger les données de l'affiche.");
            } finally {
                setLoading(false);
            }
        };
        if (token && afficheId) fetchAffiche();
    }, [token, afficheId]);
    
    // Handler pour les champs texte/date
    const handleChange = e => setAfficheData({ ...afficheData, [e.target.name]: e.target.value });
    
    // Handler dédié pour l'interrupteur
    const handleStatusChange = e => setIsPublished(e.target.checked);

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (!file) { return; }
        const maxSizeInBytes = 2 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            toast.error('Fichier trop volumineux (max 2 Mo).');
            e.target.value = null; // Important pour pouvoir resélectionner le même fichier
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        const toastId = toast.loading('Mise à jour de l\'affiche...');

        const data = new FormData();
        data.append('title', afficheData.title);
        data.append('description', afficheData.description || '');
        data.append('start_date', afficheData.start_date);
        data.append('end_date', afficheData.end_date);
        // On envoie la bonne valeur au backend
        data.append('status', isPublished ? 'published' : 'draft');
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            await apiClient.post(`/affiches/update/${afficheId}`, data, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            toast.success('Affiche mise à jour !', { id: toastId });
            navigate('/dashboard/affiches');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                toast.error('Veuillez corriger les erreurs.', { id: toastId });
            } else {
                toast.error('Une erreur est survenue lors de la mise à jour.', { id: toastId });
            }
        } finally {
            setSubmitting(false);
        }
    };
    
    if (loading) return <div className="text-center py-5 vh-100 d-flex justify-content-center align-items-center"><Spinner /></div>;
    if (initialError) return <Container className="py-5"><Alert variant="danger">{initialError}</Alert></Container>;

    return (
        <div className="bg-light" style={{ minHeight: 'calc(100vh - 72px)' }}>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-4 p-sm-5">
                                <Card.Title as="h2" className="text-center mb-4">Modifier l'affiche</Card.Title>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Titre de l'affiche *</Form.Label>
                                        <Form.Control type="text" name="title" value={afficheData.title} onChange={handleChange} isInvalid={!!errors.title} required />
                                        <Form.Control.Feedback type="invalid">{errors.title?.[0]}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Description (optionnel)</Form.Label>
                                        <Form.Control as="textarea" rows={5} name="description" value={afficheData.description} onChange={handleChange} isInvalid={!!errors.description} />
                                        <Form.Control.Feedback type="invalid">{errors.description?.[0]}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Date de début (optionnel)</Form.Label>
                                                <Form.Control type="date" name="start_date" value={afficheData.start_date} onChange={handleChange} isInvalid={!!errors.start_date} />
                                                <Form.Control.Feedback type="invalid">{errors.start_date?.[0]}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Date de fin (optionnel)</Form.Label>
                                                <Form.Control type="date" name="end_date" value={afficheData.end_date} onChange={handleChange} isInvalid={!!errors.end_date} />
                                                <Form.Control.Feedback type="invalid">{errors.end_date?.[0]}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Image</Form.Label>
                                        {imagePreview && <div className="mb-3 text-center"><Image src={imagePreview} thumbnail style={{ maxHeight: '200px' }} /></div>}
                                        <Form.Control type="file" onChange={handleImageChange} isInvalid={!!errors.image} />
                                        <Form.Text className="text-muted">Max 2 Mo. Ne choisissez un fichier que pour remplacer l'image.</Form.Text>
                                        <Form.Control.Feedback type="invalid">{errors.image?.[0]}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Check 
                                            type="switch"
                                            id="affiche-status-switch"
                                            label="Affiche publiée"
                                            checked={isPublished}
                                            onChange={handleStatusChange}
                                        />
                                        <Form.Text className="text-muted">
                                            Si activé, cette affiche sera visible par les clients.
                                        </Form.Text>
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button variant="primary" type="submit" size="lg" disabled={submitting}>
                                            {submitting ? <Spinner size="sm" /> : "Enregistrer les modifications"}
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