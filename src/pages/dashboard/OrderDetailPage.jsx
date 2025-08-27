// Fichier: ~/ecommerce/frontend/src/pages/dashboard/OrderDetailPage.jsx (Nouveau)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Row, Col, Button, Image, Badge } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';
import { getImageUrl } from '../../utils/urlHelpers';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { ArrowLeft, PersonCircle, Shop, Hash, CalendarDate, TagFill } from 'react-bootstrap-icons';

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await apiClient.get(`/orders/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                setError('Impossible de charger les détails de cette commande.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) return <div className="text-center py-5"><Spinner /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!order) return <Alert variant="warning">Commande non trouvée.</Alert>;

    // On détermine si l'utilisateur connecté est le vendeur ou le client de cette commande
    const isSellerView = user.id === order.seller_id;

    return (
        <Container className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header as="h4" className="bg-light d-flex justify-content-between align-items-center">
                    <span>Détails de la Commande #{order.id}</span>
                    <Badge pill bg="warning" className="fs-6 fw-normal">{order.status}</Badge>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-4">
                        <Col md={4}><p><CalendarDate className="me-2"/><strong>Date :</strong> {format(new Date(order.created_at), 'd MMMM yyyy', { locale: fr })}</p></Col>
                        <Col md={4}><p><Hash className="me-2"/><strong>N° de commande :</strong> {order.id}</p></Col>
                        <Col md={4}><p><TagFill className="me-2"/><strong>Total :</strong> {parseFloat(order.total_amount).toLocaleString('fr-FR')} {isSellerView ? order.client.currency : order.seller.currency}</p></Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col md={6}>
                            <h5 className="mb-3">{isSellerView ? 'Informations du Client' : 'Informations du Vendeur'}</h5>
                            <Card bg="light" className="border-0">
                                <Card.Body>
                                    <p className="mb-1"><strong><PersonCircle className="me-2"/>Nom :</strong> {isSellerView ? order.client.name : (order.seller.company_name || order.seller.name)}</p>
                                    <p className="mb-1"><strong>Email :</strong> {isSellerView ? order.client.email : order.seller.email}</p>
                                    <p className="mb-0"><strong>Téléphone :</strong> {isSellerView ? order.client.phone : order.seller.phone}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mt-4 mt-md-0">
                             <h5 className="mb-3">Adresse de livraison</h5>
                             <Card bg="light" className="border-0">
                                <Card.Body>
                                    {order.shipping_address ? (
                                        <p>{order.shipping_address}</p>
                                    ) : (
                                        <p className="text-muted">Non spécifiée.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <hr/>
                    <h5 className="mb-3">Articles commandés</h5>
                    {order.items.map(item => (
                        <Card key={item.id} className="mb-3">
                            <Card.Body className="d-flex align-items-center">
                                <Image src={getImageUrl(item.product.image_path)} style={{ width: '80px', height: '80px', objectFit: 'cover' }} rounded/>
                                <div className="ms-3 flex-grow-1">
                                    <h6 className="mb-1">{item.product.name}</h6>
                                    <p className="text-muted mb-1">{item.quantity} x {parseFloat(item.price).toLocaleString('fr-FR')}</p>
                                </div>
                                <div className="text-end">
                                    <p className="fw-bold fs-5 mb-0">{parseFloat(item.quantity * item.price).toLocaleString('fr-FR')}</p>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Card.Body>
            </Card>
        </Container>
    );
}