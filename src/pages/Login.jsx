/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/Login.jsx (Nouveau Design) */
/* =================================================================== */

import React, { useState } from 'react';
import apiClient from '../api/axiosConfig'; // <-- 1. On importe notre instance axios configurée
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './Register.css'; // On garde le CSS pour certains styles communs

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    const toastId = toast.loading('Connexion en cours...');
    try {
      const response = await apiClient.post('/login', formData);
      const { user, token } = response.data;
      auth.login(user, token);
      toast.success(`Bienvenue, ${user.name} !`, { id: toastId });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      let errorMessage = "Impossible de se connecter. Veuillez vérifier vos identifiants.";
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        errorMessage = Object.values(error.response.data.errors)[0][0];
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // On utilise le conteneur de page pour le fond et le centrage
    <div className="register-page-container">
      {/* La carte est maintenant plus petite et centrée */}
      <Card className="register-card shadow-lg" style={{ maxWidth: '28rem' }}>
        <Card.Body className="p-sm-5 p-4">

          {/* --- LE LOGO --- */}
          <div className="text-center mb-4">
            <h1 className="brand-text text-primary" style={{ fontSize: '2.5rem' }}>Sabléoun</h1>
          </div>
          
          <Card.Title className="text-center mb-1 h4 fw-bold text-dark">Espace Vendeur</Card.Title>
          <Card.Text className="text-center text-muted mb-4">
            Connectez-vous pour gérer votre boutique.
          </Card.Text>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formLoginEmail">
              <Form.Label>Adresse e-mail</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} isInvalid={!!errors.email} required />
              <Form.Control.Feedback type="invalid">{errors.email && errors.email[0]}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLoginPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" name="password" onChange={handleChange} isInvalid={!!errors.password} required />
              <Form.Control.Feedback type="invalid">{errors.password && errors.password[0]}</Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end mb-4">
              <Link to="/mot-de-passe-oublie" className="text-muted" style={{fontSize: '0.9rem'}}>Mot de passe oublié ?</Link>
            </div>
            <div className="d-grid">
              <Button type="submit" size="lg" className="fw-bold btn-submit-custom" disabled={isLoading}>
                {isLoading ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>Connexion...</>) : ("Se connecter")}
              </Button>
            </div>
            <div className="text-center mt-4">
                <p className="text-muted">Nouveau vendeur ? <Link to="/register">Créez votre boutique</Link></p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}