// Fichier: ~/ecommerce/frontend/src/pages/dashboard/ProfilePage.jsx (Final)

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Row, Col, Image as BootstrapImage, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Country, State, City } from 'country-state-city';
import '../../pages/Register.css';
import apiClient from '../../api/axiosConfig';
import { getImageUrl } from '../../utils/urlHelpers'; // On importe la fonction


export default function ProfilePage() {
    const { user, token, logout } = useAuth();

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', phone_indicator: '', company_name: '', main_service: '',
        category: '', services_description: '', country: '', countryCode: '',
        region: '', stateCode: '', city: '', currency: ''
    });

    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);

    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(false); // État pour la suppression de photo
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            const allCountries = Country.getAllCountries();
            const userCountry = allCountries.find(c => c.name === user.country);
            const userState = userCountry ? State.getStatesOfCountry(userCountry.isoCode).find(s => s.name === user.region) : null;
            
            setCountries(allCountries);

            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                phone_indicator: user.phone_indicator || '',
                company_name: user.company_name || '',
                main_service: user.main_service || '',
                category: user.category || '',
                services_description: user.services_description || '',
                country: user.country || '',
                countryCode: userCountry?.isoCode || '',
                region: user.region || '',
                stateCode: userState?.isoCode || '',
                city: user.city || '',
                currency: user.currency || '',
            });

            if (userCountry) setRegions(State.getStatesOfCountry(userCountry.isoCode));
            if (userCountry && userState) setCities(City.getCitiesOfState(userCountry.isoCode, userState.isoCode));

            if (user.profile_photo_path) {
                setPhotoPreview(getImageUrl(user.profile_photo_path));
            } else {
                setPhotoPreview(null);
            }
            setRemovePhoto(false); // Réinitialiser au cas où
        }
    }, [user]);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCountryChange = (e) => {
        const selectedCountryCode = e.target.value;
        const countryInfo = Country.getCountryByCode(selectedCountryCode);
        setFormData(prev => ({
          ...prev, 
          country: countryInfo?.name || '', countryCode: selectedCountryCode,
          phone_indicator: countryInfo ? `+${countryInfo.phonecode}` : '',
          currency: countryInfo?.currency || '',
          region: '', stateCode: '', city: '', 
        }));
        setRegions(State.getStatesOfCountry(selectedCountryCode));
        setCities([]);
    };

    const handleRegionChange = (e) => {
        const selectedStateCode = e.target.value;
        const stateInfo = State.getStateByCodeAndCountry(selectedStateCode, formData.countryCode);
        setFormData(prev => ({ ...prev, region: stateInfo?.name || '', stateCode: selectedStateCode, city: '' }));
        setCities(City.getCitiesOfState(formData.countryCode, selectedStateCode));
    };

    const handlePhotoChange = e => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image trop volumineuse (max 2 Mo).');
                e.target.value = null;
                return;
            }
            setProfilePhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
            setRemovePhoto(false); // Si on choisit une nouvelle photo, on annule la suppression
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setProfilePhotoFile(null);
        setRemovePhoto(true);
        toast('La photo sera supprimée lors de l\'enregistrement.', { icon: '🗑️' });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        const toastId = toast.loading('Mise à jour du profil...');

        const data = new FormData();
        for (const key in formData) { data.append(key, formData[key] || ''); }
        
        if (removePhoto) {
            data.append('remove_profile_photo', '1');
        } else if (profilePhotoFile) {
            data.append('profile_photo', profilePhotoFile);
        }

        try {
            const response = await apiClient.post('/user/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            
            toast.success(response.data.message || 'Profil mis à jour !', { id: toastId, duration: 4000 });
            setTimeout(() => logout(), 3000);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                toast.error('Veuillez corriger les erreurs.', { id: toastId });
            } else {
                toast.error(error.response?.data?.message || 'Une erreur est survenue.', { id: toastId });
            }
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return <div className="text-center py-5 vh-100 d-flex justify-content-center align-items-center"><Spinner /></div>;
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4">Modifier mon profil</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col lg={4}>
                        <Card className="shadow-sm border-0 mb-4">
                            <Card.Body className="text-center p-4">
                                <BootstrapImage 
                                    src={photoPreview && !removePhoto ? photoPreview : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'A')}&background=0D6EFD&color=fff&size=128`}
                                    roundedCircle 
                                    style={{ width: '128px', height: '128px', objectFit: 'cover' }} 
                                    className="mb-3 border border-3 border-white shadow-sm"
                                />
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                    <Form.Group controlId="profilePhotoUpload">
                                        <Form.Label className="btn btn-sm btn-outline-primary mb-0">Changer</Form.Label>
                                        <Form.Control type="file" onChange={handlePhotoChange} accept="image/*" className="d-none" />
                                    </Form.Group>
                                    {photoPreview && !removePhoto && (
                                        <Button variant="outline-danger" size="sm" onClick={handleRemovePhoto}>
                                            Supprimer
                                        </Button>
                                    )}
                                </div>
                                <Form.Text>JPG, PNG, GIF. Max 2Mo.</Form.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={8}>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-4">
                                <h5 className="mb-3">Informations personnelles</h5>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3">
                                        <Form.Label>Nom complet *</Form.Label>
                                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} required/>
                                        <Form.Control.Feedback type="invalid">{errors.name?.[0]}</Form.Control.Feedback>
                                    </Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3">
                                        <Form.Label>Email *</Form.Label>
                                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} required/>
                                        <Form.Control.Feedback type="invalid">{errors.email?.[0]}</Form.Control.Feedback>
                                    </Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Label>Téléphone *</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>{formData.phone_indicator || '+XXX'}</InputGroup.Text>
                                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} isInvalid={!!errors.phone} required/>
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid" style={{ display: errors.phone ? 'block' : 'none' }}>{errors.phone?.[0]}</Form.Control.Feedback>
                                </Form.Group>

                                <hr />

                                <h5 className="mb-3">Informations de la boutique</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nom de l'entreprise</Form.Label>
                                    <Form.Control type="text" name="company_name" value={formData.company_name} onChange={handleChange} isInvalid={!!errors.company_name} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Service principal</Form.Label>
                                    <Form.Control type="text" name="main_service" value={formData.main_service} onChange={handleChange} isInvalid={!!errors.main_service} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Catégorie</Form.Label>
                                    <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} isInvalid={!!errors.category} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description des services</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="services_description" value={formData.services_description} onChange={handleChange} isInvalid={!!errors.services_description} />
                                </Form.Group>
                                <Row>
                                    <Col md={4}><Form.Group className="mb-3">
                                        <Form.Label>Pays</Form.Label>
                                        <Form.Select name="country" value={formData.countryCode} onChange={handleCountryChange} isInvalid={!!errors.country}>
                                            <option value="">Sélectionnez...</option>
                                            {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                                        </Form.Select>
                                    </Form.Group></Col>
                                    <Col md={4}><Form.Group className="mb-3">
                                        <Form.Label>Région / Département</Form.Label>
                                        <Form.Select name="region" value={formData.stateCode} onChange={handleRegionChange} isInvalid={!!errors.region} disabled={!formData.countryCode || regions.length === 0}>
                                            <option value="">Sélectionnez...</option>
                                            {regions.map(r => <option key={r.isoCode} value={r.isoCode}>{r.name}</option>)}
                                        </Form.Select>
                                    </Form.Group></Col>
                                    <Col md={4}><Form.Group className="mb-3">
                                        <Form.Label>Ville</Form.Label>
                                        <Form.Select name="city" value={formData.city} onChange={handleChange} isInvalid={!!errors.city} disabled={!formData.stateCode || cities.length === 0}>
                                            <option value="">Sélectionnez...</option>
                                            {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </Form.Select>
                                    </Form.Group></Col>
                                </Row>
                                
                                <div className="text-end mt-4">
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <><Spinner as="span" size="sm" className="me-2" /> Mise à jour...</> : "Enregistrer les modifications"}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}