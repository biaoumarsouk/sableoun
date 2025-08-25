// Fichier: ~/ecommerce/frontend/src/pages/dashboard/SubscriptionPage.jsx (Final)

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { CheckCircleFill, CreditCard, Bank, Phone } from 'react-bootstrap-icons';
import './SubscriptionPage.css'; // Assurez-vous que ce fichier existe
import apiClient from '../../api/axiosConfig';

// Composant pour afficher une seule carte de plan
const PlanCard = ({ plan, onChoosePlan, isFeatured = false }) => {
    const isMonthly = plan.interval === 'month';
    const featureList = plan.features ? JSON.parse(plan.features) : [];

    return (
        <Card className={`h-100 shadow text-center subscription-card ${isFeatured ? 'featured' : ''}`}>
            <Card.Body className="p-4 d-flex flex-column">
                {isFeatured && <Badge pill bg="primary" className="position-absolute top-0 start-50 translate-middle">Le plus populaire</Badge>}
                <h3 className="fw-bold mt-2">{plan.name}</h3>
                <p className="text-muted small">{plan.description}</p>
                
                <div className="my-4">
                    <span className="display-4 fw-bolder">{parseFloat(plan.price).toLocaleString('fr-FR')}</span>
                    <span className="text-muted"> {plan.currency} / {isMonthly ? 'mois' : 'an'}</span>
                </div>

                <ListGroup variant="flush" className="text-start mb-4 flex-grow-1">
                    {featureList.map((feature, index) => (
                        <ListGroup.Item key={index} className="border-0 px-0 bg-transparent">
                            <CheckCircleFill className="text-success me-2" /> {feature}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                
                <Button 
                    variant={isFeatured ? 'primary' : 'outline-primary'} 
                    size="lg" 
                    className="mt-auto fw-bold w-100"
                    onClick={() => onChoosePlan(plan)}
                >
                    Choisir ce plan
                </Button>
            </Card.Body>
        </Card>
    );
};

export default function SubscriptionPage() {
    const { token } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await apiClient.get('/plans', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // On garde tous les plans reçus de l'API
                setPlans(response.data);
            } catch (err) {
                setError("Impossible de charger les plans d'abonnement.");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchPlans();
    }, [token]);

    const handleChoosePlan = (plan) => { setSelectedPlan(plan); setShowPaymentModal(true); };
    const handleCloseModal = () => { setSelectedPlan(null); setShowPaymentModal(false); };
    
    const handlePayment = async (gateway) => {
        setIsProcessing(true);
        const toastId = toast.loading(`Initiation du paiement via ${gateway}...`);
        try {
            console.log(`Paiement pour le plan ${selectedPlan.id} via ${gateway}`);
            
            // --- SIMULATION ---
            await new Promise(resolve => setTimeout(resolve, 2000));
            const fakeCheckoutUrl = "https://simulation-paiement.com/succes";
            toast.success("Redirection vers la page de paiement...", { id: toastId });
            
            setTimeout(() => {
                alert(`Vous seriez redirigé vers : ${fakeCheckoutUrl}`);
                handleCloseModal();
            }, 1000);
            
        } catch (error) {
            toast.error("Erreur lors de l'initiation du paiement.", { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    const renderContent = () => {
        if (loading) return <div className="text-center py-5"><Spinner /></div>;
        if (error) return <Alert variant="danger">{error}</Alert>;
        if (plans.length === 0) return (
            <div className="text-center py-5">
                <h3 className="text-muted">Aucun plan d'abonnement disponible</h3>
                <p>Les plans sont en cours de configuration. Veuillez revenir plus tard.</p>
            </div>
        );
        
        return (
            <Row className="justify-content-center align-items-center">
                {plans.map((plan, index) => (
                    <Col lg={4} md={6} key={plan.id} className="mb-4">
                        {/* On met en avant le 2ème plan (index 1) s'il y en a 3 ou plus */}
                        <PlanCard plan={plan} onChoosePlan={handleChoosePlan} isFeatured={plans.length >= 3 && index === 1} />
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold">Passez au Premium</h1>
                <p className="lead text-muted">Choisissez l'abonnement qui correspond à vos ambitions.</p>
            </div>

            {renderContent()}

            <Modal show={showPaymentModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Finaliser l'abonnement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Vous avez choisi le plan : <strong>{selectedPlan?.name}</strong></p>
                    <p className="fw-bold fs-4">{parseFloat(selectedPlan?.price || 0).toLocaleString('fr-FR')} {selectedPlan?.currency}/{selectedPlan?.interval === 'month' ? 'mois' : 'an'}</p>
                    <hr />
                    <p className="text-muted">Choisissez votre méthode de paiement :</p>
                    
                    {isProcessing && <div className="text-center p-3"><Spinner /></div>}
                    
                    {!isProcessing && (
                        <ListGroup>
                            <ListGroup.Item action onClick={() => handlePayment('Stripe')} className="d-flex align-items-center"><CreditCard size={24} className="me-3 text-primary" /><div><span className="fw-bold">Carte Bancaire</span><small className="d-block text-muted">Sécurisé par Stripe</small></div></ListGroup.Item>
                            <ListGroup.Item action onClick={() => handlePayment('KkiaPay')} className="d-flex align-items-center"><Phone size={24} className="me-3 text-warning" /><div><span className="fw-bold">Mobile Money</span><small className="d-block text-muted">via KkiaPay</small></div></ListGroup.Item>
                            <ListGroup.Item action onClick={() => handlePayment('FedaPay')} className="d-flex align-items-center"><Bank size={24} className="me-3 text-info" /><div><span className="fw-bold">Mobile Money</span><small className="d-block text-muted">via FedaPay</small></div></ListGroup.Item>
                        </ListGroup>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}