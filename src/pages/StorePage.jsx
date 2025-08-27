// Fichier: ~/ecommerce/frontend/src/pages/StorePage.jsx (Final)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Offcanvas, ListGroup, Image as BootstrapImage, Badge, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import { getImageUrl } from '../utils/urlHelpers';
import toast from 'react-hot-toast';
import { Plus, Dash, Cart4, ArrowLeft } from 'react-bootstrap-icons';
import './StorePage.css';

// Composant pour la carte produit
const StoreProductCard = ({ product, onAddToCart }) => (
    <Card className="h-100 shadow-sm product-card">
        <Card.Img variant="top" src={getImageUrl(product.image_path)} className="product-card-img" />
        <Card.Body className="d-flex flex-column">
            <Card.Title className="fw-bold">{product.name}</Card.Title>
            <Card.Text className="text-primary fs-5 fw-bold mt-2">
                {product.price ? `${parseFloat(product.price).toLocaleString('fr-FR')} ${product.user?.currency}` : 'Sur demande'}
            </Card.Text>
            <Button variant="primary" className="mt-auto" onClick={() => onAddToCart(product)}>
                <Cart4 className="me-2" /> Ajouter
            </Button>
        </Card.Body>
    </Card>
);


export default function StorePage() {
  const { slug } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
        try {
            const [sellerResponse, productsResponse] = await Promise.all([
                apiClient.get(`/sellers/${slug}`),
                apiClient.get(`/sellers/${slug}/products`)
            ]);
            setSeller(sellerResponse.data);
            setProducts(productsResponse.data);
        } catch (err) { setError("Impossible de charger la boutique."); }
        finally { setLoading(false); }
    };
    fetchStoreData();
  }, [slug]);

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
            return prevItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return [...prevItems, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} ajouté au panier !`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    setCartItems(prevItems => {
      if (isNaN(quantity) || quantity < 1) {
        const newItems = prevItems.filter(item => item.id !== productId);
        if (newItems.length === 0) setIsCartOpen(false);
        return newItems;
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handlePlaceOrder = async () => {
    if (!token) {
        toast.error("Veuillez vous connecter pour passer votre commande.");
        navigate('/login', { state: { from: location } });
        return;
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading("Envoi de la commande...");
    const orderItems = cartItems.map(({ id, quantity }) => ({ product_id: id, quantity }));

    try {
        await apiClient.post('/order', { seller_id: seller.id, items: orderItems });
        toast.success("Votre commande a bien été passée !", { id: toastId });
        setCartItems([]);
        setIsCartOpen(false);
        navigate('/dashboard/commandes'); 
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Une erreur est survenue.";
        toast.error(errorMessage, { id: toastId });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5 vh-100 d-flex justify-content-center align-items-center"><Spinner /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!seller) return <Alert variant="warning">Boutique non trouvée.</Alert>;

  return (
    <>
      <Container className="py-5 mt-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">Commander chez {seller.company_name || seller.name}</h1>
          <p className="lead text-muted">Ajoutez des articles à votre panier pour passer commande.</p>
        </div>
        
        <Row>
          {products.map(product => (
            <Col lg={3} md={4} sm={6} key={product.id} className="mb-4">
              <StoreProductCard product={product} onAddToCart={handleAddToCart} />
            </Col>
          ))}
        </Row>
      </Container>

      {totalItems > 0 && !isCartOpen && (
        <Button variant="primary" className="cart-fab shadow-lg rounded-circle" onClick={() => setIsCartOpen(true)}>
            <Cart4 size={28} className="text-white" />
            <Badge pill bg="danger" className="cart-fab-badge">{totalItems}</Badge>
        </Button>
      )}

      <Offcanvas show={isCartOpen} onHide={() => setIsCartOpen(false)} placement="end" style={{ width: '400px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Votre Commande</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          {cartItems.length > 0 ? (
            <ListGroup variant="flush" className="flex-grow-1">
              {cartItems.map(item => (
                <ListGroup.Item key={item.id} className="d-flex align-items-center px-0">
                  <BootstrapImage src={getImageUrl(item.image_path)} style={{width: '60px', height: '60px', objectFit: 'cover'}} rounded />
                  <div className="ms-3 flex-grow-1">
                    <p className="fw-bold mb-0 small">{item.name}</p>
                    <small className="text-muted">{parseFloat(item.price).toLocaleString('fr-FR')} {seller.currency}</small>
                  </div>
                  
                  <InputGroup size="sm" style={{ width: '120px' }}>
                    <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                      <Dash/>
                    </Button>
                    <Form.Control
                      type="number"
                      className="text-center fw-bold"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                      min="0"
                    />
                    <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                      <Plus/>
                    </Button>
                  </InputGroup>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-center text-muted m-auto">Votre panier est vide.</p>
          )}
        </Offcanvas.Body>
        {cartItems.length > 0 && (
          <div className="p-3 border-top bg-light">
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span>{totalAmount.toLocaleString('fr-FR')} {seller.currency}</span>
            </div>
            <div className="d-grid">
              <Button size="lg" onClick={handlePlaceOrder} disabled={isSubmitting}>
                {isSubmitting ? <Spinner size="sm" /> : `Passer la commande (${totalItems})`}
              </Button>
            </div>
          </div>
        )}
      </Offcanvas>
    </>
  );
}