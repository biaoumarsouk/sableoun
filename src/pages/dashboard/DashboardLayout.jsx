/* =================================================================== */
/* Fichier: ~/ecommerce/frontend/src/pages/dashboard/DashboardLayout.jsx (Profil Riche) */
/* =================================================================== */

import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Button, Navbar, Container, Image, NavDropdown } from 'react-bootstrap';
import { List as HamburgerIcon, BoxArrowRight, PencilSquare, GeoAltFill } from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/urlHelpers'; // On importe la fonction

// Import des fichiers CSS nécessaires
import '../../components/UserDropdown.css';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

  const profileImageUrl = user?.profile_photo_path 
    ? getImageUrl(user.profile_photo_path)
    : null;

  return (
    <div className="dashboard-layout d-flex h-100">
      <div 
        className={`sidebar-overlay ${sidebarIsOpen ? 'is-open' : ''}`}
        onClick={toggleSidebar}
      />
      <Sidebar isOpen={sidebarIsOpen} toggle={toggleSidebar} />

      <div className="dashboard-content-wrapper flex-grow-1 d-flex flex-column">
        <Navbar bg="white" className="shadow-sm sticky-top">
          <Container fluid>
            <Button variant="light" onClick={toggleSidebar} className="d-lg-none">
              <HamburgerIcon size={24} />
            </Button>
            
            <div className="ms-auto">
              <NavDropdown 
                title={
                  <div className="d-flex align-items-center">
                    {profileImageUrl ? (
                      <Image 
                        src={profileImageUrl} 
                        roundedCircle 
                        style={{width: '40px', height: '40px', objectFit: 'cover'}} 
                        className="me-2 border" 
                      />
                    ) : (
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <span className="fw-bold text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="d-none d-md-inline">{user?.name}</span>
                  </div>
                }
                id="user-dropdown"
                align="end"
                className="user-dropdown"
              >
                {/* En-tête du menu déroulant avec toutes les informations */}
                <div className="user-dropdown-header">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    {profileImageUrl ? (
                      <Image src={profileImageUrl} roundedCircle className="user-dropdown-avatar border" />
                    ) : (
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center user-dropdown-avatar">
                        <span>{user?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="user-dropdown-name">{user?.name}</div>
                  <div className="user-dropdown-email">{user?.email}</div>
                  
                  {user?.company_name && (
                    <div className="user-dropdown-company mt-2">{user.company_name}</div>
                  )}
                  {user?.city && user?.country && (
                    <div className="user-dropdown-location mt-1">
                      <GeoAltFill size={12} className="me-1" /> {user.city}, {user.country}
                    </div>
                  )}
                </div>

                {/* Liens d'action */}
                <NavDropdown.Item as={Link} to="/dashboard/profil">
                  <PencilSquare className="me-2" /> Modifier le profil
                </NavDropdown.Item>
                
                <NavDropdown.Divider />
                
                <NavDropdown.Item onClick={logout} className="text-danger">
                  <BoxArrowRight className="me-2" /> Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Container>
        </Navbar>
        
        <main className="dashboard-main-content">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}