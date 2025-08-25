// Fichier: src/pages/dashboard/ProductListPage.jsx (Version Finale Garantie)

import React, { useState, useEffect } from 'react';
// On importe Badge pour afficher le statut
import { Table, Button, Image, Card, Spinner, Alert, Modal, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { PencilSquare, Trash, PlusCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/urlHelpers';
import apiClient from '../../api/axiosConfig';

export default function ProductListPage() {
    const { user, token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleShowDeleteModal = (product) => { setProductToDelete(product); setShowDeleteModal(true); };
    const handleCloseDeleteModal = () => { setProductToDelete(null); setShowDeleteModal(false); };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        const toastId = toast.loading('Suppression en cours...');
        try {
            await apiClient.delete(`/products/delete/${productToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(current => current.filter(p => p.id !== productToDelete.id));
            toast.success('Produit supprimé !', { id: toastId });
            handleCloseDeleteModal();
        } catch (err) {
            toast.error('Erreur lors de la suppression.', { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const response = await apiClient.get('/user/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data);
            } catch (err) {
                setError('Impossible de charger vos produits.');
            } finally {
                setLoading(false);
            }
        };
        if(token) fetchUserProducts();
    }, [token]);
    
    if (loading) return <div className="text-center py-5"><Spinner /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <Card className="shadow-sm border-0">
                <Card.Header as="h5" className="bg-white d-flex justify-content-between align-items-center">
                    Gestion de vos Produits
                    <Button as={Link} to="/dashboard/produits/nouveau">
                        <PlusCircleFill className="me-2" />
                        Ajouter un produit
                    </Button>
                </Card.Header>
                <Card.Body>
                    {products.length > 0 ? (
                        <Table striped hover responsive className="align-middle">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Nom</th>
                                    <th>Prix</th>
                                    <th>Statut</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td><Image src={getImageUrl(product.image_path)} alt={product.name} rounded style={{width: '50px', height: '50px', objectFit: 'cover'}} /></td>
                                        <td>{product.name}</td>
                                        <td>{product.price ? `${parseFloat(product.price).toLocaleString('fr-FR')} ${user?.currency || 'F'}` : 'N/A'}</td>
                                        
                                        {/* --- 2. AFFICHAGE DU BADGE DE STATUT --- */}
                                        <td>
                                            {product.status === 'published' ? (
                                                <Badge bg="success">Publié</Badge>
                                            ) : (
                                                <Badge bg="secondary">Brouillon</Badge>
                                            )}
                                        </td>
                                        
                                        <td className="text-center">
                                            {/* On enveloppe les boutons dans un div avec des classes Flexbox */}
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button as={Link} to={`/dashboard/produits/modifier/${product.id}`} variant="outline-primary" size="sm" title="Modifier">
                                                <PencilSquare />
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleShowDeleteModal(product)} title="Supprimer">
                                                <Trash />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center p-4">
                            <p className="text-muted mb-3">Vous n'avez aucun produit pour le moment.</p>
                            <Button as={Link} to="/dashboard/produits/nouveau" variant="primary">Ajouter votre premier produit</Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton><Modal.Title><ExclamationTriangleFill className="text-danger me-2" /> Confirmation</Modal.Title></Modal.Header>
                <Modal.Body>Êtes-vous sûr de vouloir supprimer <strong>"{productToDelete?.name}"</strong> ?<br />Cette action est irréversible.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={isDeleting}>Annuler</Button>
                    <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleting}>{isDeleting ? <Spinner size="sm" /> : "Supprimer"}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}