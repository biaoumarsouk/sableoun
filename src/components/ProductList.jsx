// Fichier: ~/ecommerce/frontend/src/components/ProductList.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

export default function ProductList({ products }) {
  return (
    <Row xs={2} md={3} lg={4} xl={5} className="g-5">
      {products.map((product) => (
        <Col key={product.id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}