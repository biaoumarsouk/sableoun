/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/pages/Register.jsx (FINAL COMPLET) */
/* =================================================================== */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Country, State, City } from 'country-state-city';

// Importations des composants Bootstrap
import { Button, Form, Card, Modal, ListGroup, Spinner, Row, Col, Image as BootstrapImage, InputGroup } from 'react-bootstrap';
import { PlusCircle, CaretDownFill, PersonCircle } from 'react-bootstrap-icons';
import './Register.css';
import apiClient from '../api/axiosConfig';

// --- Données pour la sélection de service ---
const serviceOptions = [ "Vente de Produits", "Vente de Formations", "Prestation de Services", "Agriculture & Élevage", "Autres" ];
const categoryOptions = {
  "Vente de Produits": ["Vêtements & Mode", "Électronique", "Maison & Jardin", "Alimentation & Boissons", "Art & Artisanat"],
  "Vente de Formations": ["Développement Web", "Marketing Digital", "Développement Personnel", "Langues Étrangères", "Musique & Arts"],
  "Prestation de Services": ["Consulting", "Rédaction & Traduction", "Design Graphique", "Coaching Sportif", "Réparation & Maintenance"],
  "Agriculture & Élevage": ["Fruits & Légumes", "Produits Laitiers & Œufs", "Viande & Volaille", "Miel & Produits de la ruche", "Produits Transformés"],
  "Autres": []
};

export default function Register() {
  const navigate = useNavigate();

  // --- DÉCLARATION DES ÉTATS (STATES) ---
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    main_service: '',
    category: '',
    services_description: '',
    country: '', countryCode: '',
    region: '', stateCode: '',
    city: '', 
    currency: '', phone_indicator: '', phone: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  // --- LOGIQUE (HOOKS ET FONCTIONS) ---
  useEffect(() => { setCountries(Country.getAllCountries()); }, []);

  useEffect(() => {
    if (formData.main_service) {
      setAvailableCategories(categoryOptions[formData.main_service] || []);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setAvailableCategories([]);
    }
  }, [formData.main_service]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La photo est trop lourde (2 Mo max).');
        e.target.value = null; return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSelectService = (service) => { setFormData({ ...formData, main_service: service }); setShowServiceModal(false); };
  const handleSelectCategory = (category) => { setFormData({ ...formData, category: category }); setShowCategoryModal(false); };

  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    const countryInfo = Country.getCountryByCode(selectedCountryCode);
    setFormData({
      ...formData, country: countryInfo?.name || '', countryCode: selectedCountryCode,
      region: '', stateCode: '', city: '', currency: countryInfo?.currency || '',
      phone_indicator: countryInfo ? `+${countryInfo.phonecode}` : '',
    });
    setRegions(State.getStatesOfCountry(selectedCountryCode));
    setCities([]);
  };

  const handleRegionChange = (e) => {
    const selectedStateCode = e.target.value;
    const stateInfo = State.getStateByCodeAndCountry(selectedStateCode, formData.countryCode);
    setFormData({ ...formData, region: stateInfo?.name || '', stateCode: selectedStateCode, city: '' });
    setCities(City.getCitiesOfState(formData.countryCode, selectedStateCode));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (profilePhoto) {
      data.append('profile_photo', profilePhoto);
    }

    const toastId = toast.loading('Enregistrement en cours...');
    try {
      await apiClient.post('/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Inscription réussie ! Vous allez être redirigé.', { id: toastId });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      let errorMessage = "Une erreur est survenue.";
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        const firstError = Object.values(error.response.data.errors)[0][0];
        errorMessage = `Erreur : ${firstError}`;
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page-container mt-5">
      <Card className="register-card shadow-lg" style={{ maxWidth: '45rem' }}>
        <Card.Body className="p-sm-5 p-4">
          <div className="text-center mb-4">
            <h1 className="brand-text text-primary" style={{ fontSize: '2.5rem' }}>Sabléoun</h1>
          </div>
          <Card.Title className="text-center mb-4 h4 fw-bold text-dark">Devenez Vendeur</Card.Title>
          
          <Form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <label htmlFor="profile-photo-upload" className="profile-photo-label">
                {photoPreview ? (
                  <BootstrapImage src={photoPreview} roundedCircle style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer' }} />
                ) : (
                  <PersonCircle size={120} className="text-secondary" style={{ cursor: 'pointer' }} />
                )}
              </label>
              <Form.Control type="file" id="profile-photo-upload" onChange={handlePhotoChange} accept="image/*" style={{ display: 'none' }} isInvalid={!!errors.profile_photo}/>
              <Form.Text className="d-block mt-2">Ajouter une photo de profil (optionnel)</Form.Text>
              {errors.profile_photo && <small className="text-danger">{errors.profile_photo[0]}</small>}
            </div>

            <div className="form-separator"><span>Informations de base</span></div>
            <Form.Group className="mb-3"><Form.Label>Votre nom complet *</Form.Label><Form.Control type="text" name="name" onChange={handleChange} isInvalid={!!errors.name} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Nom de l'entreprise</Form.Label><Form.Control type="text" name="company_name" onChange={handleChange} isInvalid={!!errors.company_name} /></Form.Group>
            
            <div className="form-separator"><span>Votre activité</span></div>
            <Form.Group className="mb-3"><Form.Label>Service Principal *</Form.Label><Button variant="light" className="w-100 d-flex justify-content-between align-items-center custom-select-button" onClick={() => setShowServiceModal(true)}><span>{formData.main_service || "Sélectionnez..."}</span><CaretDownFill /></Button></Form.Group>
            {formData.main_service && (
              <>
                {formData.main_service !== 'Autres' ? (
                  <Form.Group className="mb-3"><Form.Label>Catégorie *</Form.Label><Button variant="light" className="w-100 d-flex justify-content-between align-items-center custom-select-button" onClick={() => setShowCategoryModal(true)}><span>{formData.category || "Sélectionnez..."}</span><CaretDownFill /></Button></Form.Group>
                ) : (
                  <Form.Group className="mb-3" controlId="formCategoryCustom"><Form.Label>Précisez votre catégorie *</Form.Label><Form.Control type="text" name="category" placeholder="Ex: Événementiel, Photographie, etc." onChange={handleChange} isInvalid={!!errors.category} required /></Form.Group>
                )}
              </>
            )}
             <Form.Group className="mb-3"><Form.Label>Description de votre activité</Form.Label><Form.Control as="textarea" rows={3} name="services_description" onChange={handleChange} isInvalid={!!errors.services_description}/></Form.Group>

            <div className="form-separator"><span>Localisation</span></div>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Pays *</Form.Label><Form.Select name="country" value={formData.countryCode} onChange={handleCountryChange} isInvalid={!!errors.country} required><option value="">Choisissez...</option>{countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Région / État *</Form.Label><Form.Select name="region" value={formData.stateCode} onChange={handleRegionChange} disabled={!formData.countryCode} isInvalid={!!errors.region} required><option value="">Choisissez...</option>{regions.map(r => <option key={r.isoCode} value={r.isoCode}>{r.name}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3"><Form.Label>Ville</Form.Label><Form.Select name="city" value={formData.city} onChange={handleChange} disabled={!formData.stateCode || cities.length === 0} isInvalid={!!errors.city}><option value="">Choisissez...</option>{cities.map(city => <option key={city.name} value={city.name}>{city.name}</option>)}</Form.Select></Form.Group>

            <div className="form-separator"><span>Informations de contact & Sécurité</span></div>
            <Form.Group className="mb-3"><Form.Label>Adresse e-mail *</Form.Label><Form.Control type="email" name="email" onChange={handleChange} isInvalid={!!errors.email} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Numéro de téléphone *</Form.Label><InputGroup><InputGroup.Text>{formData.phone_indicator || '+XXX'}</InputGroup.Text><Form.Control type="tel" name="phone" onChange={handleChange} isInvalid={!!errors.phone} required /></InputGroup></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Mot de passe *</Form.Label><Form.Control type="password" name="password" onChange={handleChange} isInvalid={!!errors.password} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Confirmer le mot de passe *</Form.Label><Form.Control type="password" name="password_confirmation" onChange={handleChange} isInvalid={!!errors.password} required /></Form.Group>
            
            <div className="d-grid mt-4"><Button type="submit" size="lg" className="fw-bold btn-submit-custom" disabled={isLoading}>{isLoading ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>Enregistrement...</>) : ("Créer mon compte")}</Button></div>
            <div className="text-center mt-4"><p className="text-muted">Déjà vendeur ? <Link to="/login">Connectez-vous</Link></p></div>
          </Form>
        </Card.Body>
      </Card>

      {/* --- MODALES --- */}
      <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Activité Principale</Modal.Title></Modal.Header>
        <Modal.Body><ListGroup>{serviceOptions.map(service => (<ListGroup.Item action onClick={() => handleSelectService(service)} key={service}>{service}</ListGroup.Item>))}</ListGroup></Modal.Body>
      </Modal>

      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Catégorie de "{formData.main_service}"</Modal.Title></Modal.Header>
        <Modal.Body><ListGroup>{availableCategories.map(cat => (<ListGroup.Item action onClick={() => handleSelectCategory(cat)} key={cat}>{cat}</ListGroup.Item>))}<ListGroup.Item action variant="success" onClick={() => alert("Fonctionnalité 'Ajouter' à venir !")}><PlusCircle className="me-2" /> Ajouter une nouvelle catégorie</ListGroup.Item></ListGroup></Modal.Body>
      </Modal>
    </div>
  );
}