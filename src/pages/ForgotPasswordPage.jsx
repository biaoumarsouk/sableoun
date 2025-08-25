/* =================================================================== */
/* Fichier: ~/ecommerce/frontend/src/pages/ForgotPasswordPage.jsx (Final) */
/* =================================================================== */

import React, { useState } from 'react';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // <-- Importer Link
import { EnvelopeCheckFill } from 'react-bootstrap-icons'; // <-- Importer une icône
import './Register.css'; // On réutilise les styles
import apiClient from '../api/axiosConfig';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false); // Nouvel état pour gérer le message de succès

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Envoi de la demande...');
        try {
            const response = await apiClient.post('/forgot-password', { email });
            toast.success(response.data.message, { id: toastId });
            setIsSent(true); // On affiche le message de confirmation
        } catch (error) {
            toast.error("Cet e-mail n'a pas été trouvé dans notre système.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page-container">
            <Card className="register-card" style={{ maxWidth: '30rem' }}>
                <Card.Body className="p-5 text-center">
                    <div className="mb-4">
                        <EnvelopeCheckFill size={50} className="text-primary" />
                    </div>

                    <h2 className="fw-bold mb-3">Mot de Passe Oublié</h2>
                    
                    {/* On affiche un message différent si l'email a été envoyé */}
                    {isSent ? (
                        <div className="text-muted">
                            <p>Si un compte correspondant à <strong>{email}</strong> existe, un e-mail de réinitialisation y a été envoyé.</p>
                            <p>Veuillez consulter votre boîte de réception (et vos spams).</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-muted mb-4">Pas de panique ! Entrez votre e-mail et nous vous aiderons à créer un nouveau mot de passe.</p>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label>Adresse e-mail</Form.Label>
                                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button type="submit" disabled={isLoading} className="btn-submit-custom">
                                        {isLoading ? <Spinner size="sm" /> : "Envoyer le lien de réinitialisation"}
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}

                    <div className="mt-4">
                        <Link to="/login">Retour à la connexion</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
  );
}