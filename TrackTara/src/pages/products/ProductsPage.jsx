import React from "react";
import ProductsList from "./components/ProductsList.jsx";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

const ProductsPage = () => {
  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Продукти</h2>
        </Col>
        <Col xs="auto">
          <Link to="/product/add">
            <button className="btn btn-primary">
              <img
                src="/Icons for functions/free-icon-plus-3303893.png"
                alt="Додати продукт"
                className="me-2"
                style={{ width: '20px', height: '20px' }}
              />
              Додати продукт
            </button>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <ProductsList />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductsPage;
