/* =================================================================== */
/* Fichier: ~/ecommerce/frontend/src/pages/ResetPasswordPage.jsx (Final) */
/* =================================================================== */

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyFill } from 'react-bootstrap-icons'; // On importe une icône de clé
import './Register.css';
import apiClient from '../api/axiosConfig';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        token: '', email: '', password: '', password_confirmation: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        if (token && email) {
            setFormData(prev => ({ ...prev, token, email }));
        } else {
            toast.error("Lien de réinitialisation invalide ou expiré.");
            navigate('/mot-de-passe-oublie');
        }
    }, [searchParams, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const toastId = toast.loading('Réinitialisation en cours...');
        try {
            const response = await apiClient.post('/reset-password', formData);
            toast.success(response.data.message, { id: toastId });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                toast.error("Veuillez corriger les erreurs.", { id: toastId });
            } else {
                toast.error(error.response?.data?.message || "Une erreur est survenue.", { id: toastId });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // On utilise la classe parente pour le fond et le centrage global
        <div className="register-page-container">
            {/* On réutilise la classe de carte pour le style */}
            <Card className="register-card" style={{ maxWidth: '28rem' }}>
                {/* On transforme le Card.Body en conteneur flex vertical */}
                <Card.Body className="p-5 d-flex flex-column justify-content-center">
                    
                    {/* --- ICÔNE EN HAUT --- */}
                    <div className="text-center mb-4">
                        <KeyFill size={50} className="text-primary" />
                    </div>

                    <h2 className="text-center fw-bold mb-4">Nouveau Mot de Passe</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nouveau mot de passe *</Form.Label>
                            <Form.Control 
                                type="password" 
                                name="password"
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                                required 
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password && errors.password[0]}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmer le mot de passe *</Form.Label>
                            <Form.Control 
                                type="password" 
                                name="password_confirmation"
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        
                        <div className="d-grid mt-4">
                            <Button type="submit" disabled={isLoading} className="btn-submit-custom">
                                {isLoading ? <Spinner size="sm" /> : "Changer le mot de passe"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}