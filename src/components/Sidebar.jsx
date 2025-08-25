/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/components/Sidebar.jsx (Final)   */
/* =================================================================== */

import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importations des icônes
import { 
  Speedometer2, 
  BoxSeam, 
  ListCheck, 
  BarChartLine, 
  PersonVcard, 
  CreditCard,
  BoxArrowLeft,
  Person,
  MegaphoneFill,
  ChatDotsFill 
} from 'react-bootstrap-icons';

// Importation du fichier CSS qui gère tout le style et le comportement
import './Sidebar.css';

export default function Sidebar({ isOpen, toggle }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (isOpen) {
      toggle(); // Ferme la sidebar sur mobile avant de déconnecter
    }
    logout();
  };

  // La classe 'is-open' est ajoutée dynamiquement pour le comportement mobile
  const sidebarClasses = `sidebar ${isOpen ? 'is-open' : ''}`;

  return (
    <div className={sidebarClasses}>
      <div className="sidebar-content">
        <div className="text-center my-4">
          <h4 className="fw-bold text-primary">Sabléoun</h4>
          <small className="text-muted">Espace Vendeur</small>
        </div>
        
        <Nav className="flex-column nav-pills">
          <Nav.Link as={NavLink} to="/dashboard" end onClick={isOpen ? toggle : undefined} className="d-flex align-items-center mb-2">
            <Speedometer2 className="me-3" size={20} />
            Vue d'ensemble
          </Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard/produits" onClick={isOpen ? toggle : undefined} className="d-flex align-items-center mb-2">
            <BoxSeam className="me-3" size={20} />
            Mes Produits
          </Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard/affiches"  onClick={isOpen ? toggle : undefined} className="d-flex align-items-center mb-2">
            <MegaphoneFill className="me-3" size={20} />
            Mes Affiches
          </Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard/messages"  onClick={isOpen ? toggle : undefined} className="d-flex align-items-center">
            <ChatDotsFill className="me-3" size={20} />
            <span>Messages</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard/commandes" onClick={isOpen ? toggle : undefined} className="d-flex align-items-center mb-2">
            <ListCheck className="me-3" size={20} />
            Commandes
          </Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard/statistiques" onClick={isOpen ? toggle : undefined} className="d-flex align-items-center mb-2">
            <BarChartLine className="me-3" size={20} />
            Statistiques
          </Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard/profil"  onClick={isOpen ? toggle : undefined} className="d-flex align-items-center mb-2">
            <PersonVcard className="me-3" size={20} />
            Mon Profil
          </Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard/abonnement" onClick={isOpen ? toggle : undefined} className="d-flex align-items-center mb-2">
            <CreditCard className="me-3" size={20} />
            Abonnement
          </Nav.Link>
          <Nav.Link as={NavLink} to="/" onClick={isOpen ? toggle : undefined} className="d-flex align-items-center mb-2">
            <Person className="me-3" size={20} />
            Espace Client
          </Nav.Link>
        </Nav>
      </div>

      <div className="sidebar-logout">
        <hr className="my-2" />
        <Nav className="flex-column">
          <Nav.Link onClick={handleLogout} className="d-flex align-items-center text-danger">
            <BoxArrowLeft className="me-3" size={20} />
            Déconnexion
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
}