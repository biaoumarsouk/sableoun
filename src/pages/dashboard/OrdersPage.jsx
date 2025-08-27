// Fichier: ~/ecommerce/frontend/src/pages/dashboard/OrdersPage.jsx (Nouveau Design)

import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Table, Badge, Button, Row, Col } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { BoxArrowInDown, BoxArrowUp } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

// Composant réutilisable pour afficher la table des commandes
const OrderTable = ({ orders, type }) => {
    if (orders.length === 0) {
        return <div className="text-center p-5"><p className="text-muted">Vous n'avez aucune commande {type === 'placed' ? 'effectuée' : 'reçue'} pour le moment.</p></div>;
    }

    return (
        <Table striped hover responsive className="align-middle">
            <thead>
                <tr>
                    <th>ID Commande</th>
                    <th>{type === 'placed' ? 'Vendeur' : 'Client'}</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => {
                    const currency = type === 'placed' ? order.seller?.currency : order.client?.currency;
                    return (
                        <tr key={order.id}>
                            <td><strong>#{order.id}</strong></td>
                            <td>{type === 'placed' ? (order.seller?.company_name || order.seller?.name) : order.client?.name}</td>
                            <td>{format(new Date(order.created_at), 'd MMMM yyyy', { locale: fr })}</td>
                            <td>{parseFloat(order.total_amount).toLocaleString('fr-FR')} {currency}</td>
                            <td>
                                <Badge pill bg="warning" className="fw-normal">{order.status}</Badge>
                            </td>
                            <td>
                                <Button as={Link} to={`/dashboard/commandes/${order.id}`} variant="outline-primary" size="sm">
                                    Voir
                                </Button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default function OrdersPage() {
    // 'received' (ventes) ou 'placed' (achats)
    const [activeView, setActiveView] = useState('received');
    const [placedOrders, setPlacedOrders] = useState([]);
    const [receivedOrders, setReceivedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const [placedRes, receivedRes] = await Promise.all([
                    apiClient.get('/orders/placed'),
                    apiClient.get('/orders/received')
                ]);
                setPlacedOrders(placedRes.data);
                setReceivedOrders(receivedRes.data);
            } catch (err) {
                setError('Impossible de charger les commandes.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const renderContent = () => {
        if (loading) return <div className="text-center p-5"><Spinner /></div>;
        if (error) return <Alert variant="danger">{error}</Alert>;
        
        return activeView === 'received' 
            ? <OrderTable orders={receivedOrders} type="received" />
            : <OrderTable orders={placedOrders} type="placed" />;
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Gestion des Commandes</h2>

            {/* --- NOUVEAUX BOUTONS DE SÉLECTION --- */}
            <Row className="mb-4">
                <Col>
                    <Card 
                        className={`p-3 text-center shadow-sm h-100 ${activeView === 'received' ? 'bg-primary text-white' : 'bg-light'}`}
                        onClick={() => setActiveView('received')}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                    >
                        <BoxArrowInDown size={30} className="mb-2" />
                        <h5 className="mb-0 fw-bold">Mes Ventes</h5>
                        <small>({receivedOrders.length} commandes reçues)</small>
                    </Card>
                </Col>
                <Col>
                    <Card 
                        className={`p-3 text-center shadow-sm h-100 ${activeView === 'placed' ? 'bg-primary text-white' : 'bg-light'}`}
                        onClick={() => setActiveView('placed')}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                    >
                        <BoxArrowUp size={30} className="mb-2" />
                        <h5 className="mb-0 fw-bold">Mes Achats</h5>
                        <small>({placedOrders.length} commandes effectuées)</small>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    {renderContent()}
                </Card.Body>
            </Card>
        </Container>
    );
}