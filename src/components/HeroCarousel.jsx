/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/components/HeroCarousel.jsx (Final) */
/* =================================================================== */

import React from 'react';
import { Carousel } from 'react-bootstrap';
import './HeroCarousel.css'; // On importe notre CSS corrigé
import servicesImage from '../assets/services_carousel.jpg';
import agricultureImage from '../assets/agriculture_carousel.jpg'; // <-- NOUVELLE IMAGE
import formationImage from '../assets/formation_carousel.jpg';
import artisanatImage from '../assets/artisanat_carousel.jpg';
import produitsImage from '../assets/produits_carousel.jpg'; 



export default function HeroCarousel() {
  const images = [
    {
      src: artisanatImage,
      alt: "Artisanat Local",
      title: "Le Cœur de l'Artisanat",
      description: "Découvrez des créations uniques, faites avec passion par nos vendeurs locaux."
    },
    {
      src: produitsImage,
      alt: "Commerce de Produits",
      title: "Des Produits pour Tous les Goûts",
      description: "Explorez une large gamme d'articles uniques proposés par nos vendeurs."
    },
    {
      src: agricultureImage,
      alt: "Agriculture et Élevage",
      title: "Le Goût de la Terre",
      description: "Soutenez nos agriculteurs et éleveurs en choisissant des produits frais et locaux."
    },
    {
      src: formationImage,
      alt: "Formations en Ligne",
      title: "Apprenez de Nouvelles Compétences",
      description: "Nos vendeurs experts partagent leur savoir-faire."
    },
    {
      src: servicesImage,
      alt: "Services de Qualité",
      title: "Des Services sur Mesure",
      description: "Trouvez le prestataire idéal pour tous vos projets."
    }
  ];

  return (
    <div className="hero-carousel-container mt-5">
      <Carousel>
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={image.src}
              alt={image.alt}
            />
            {/* --- CORRECTION : On enlève les classes "d-none" --- */}
            {/* Le texte est maintenant TOUJOURS visible, mais le CSS va adapter sa taille */}
            <Carousel.Caption className="carousel-caption-custom">
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}