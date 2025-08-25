/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/components/Header.jsx (Final)  */
/* =================================================================== */

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { BoxArrowRight, PersonCircle, Speedometer2 } from 'react-bootstrap-icons';

import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      className="shadow-sm fixed-top"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container fluid className="px-md-5">
        <span className="navbar-brand brand-text text-primary">
          Sabléoun
        </span>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <div className="toggler-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/" end onClick={() => setExpanded(false)}>Accueil</Nav.Link>
            <Nav.Link as={NavLink} to="/decouvrir" onClick={() => setExpanded(false)}>Découvrir</Nav.Link>
            <Nav.Link as={NavLink} to="/vendeurs" onClick={() => setExpanded(false)}>Nos Vendeurs</Nav.Link>
            <Nav.Link as={NavLink} to="/a-propos" onClick={() => setExpanded(false)}>À propos</Nav.Link>

            <div className="vr mx-2 d-none d-lg-block"></div>

            {user ? (
              // --- LA CORRECTION EST ICI ---
              <NavDropdown 
                title={<><PersonCircle className="me-1" />{user.name}</>} 
                id="basic-nav-dropdown" 
                align="end"
              >
                <NavDropdown.Item as={Link} to="/dashboard" onClick={() => setExpanded(false)}>
                  <Speedometer2 className="me-2" />
                  Tableau de bord
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => { logout(); setExpanded(false); }} className="text-danger">
                  <BoxArrowRight className="me-2" />
                  Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={NavLink} to="/login" onClick={() => setExpanded(false)}>Se connecter</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}