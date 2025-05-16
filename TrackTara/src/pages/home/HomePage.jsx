import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package, Users, Shield, BarChart, ArrowRight } from 'lucide-react';

const HomePage = () => {
    const { isAuthenticated } = useSelector((state) => state.user);

    const features = [
        {
            icon: <Package className="feature-icon" />,
            title: "Управління тарою",
            description: "Ефективна система обліку та управління різними типами тари та контейнерів"
        },
        {
            icon: <Users className="feature-icon" />,
            title: "Командна робота",
            description: "Спільна робота над проектами з можливістю розподілу ролей та прав доступу"
        },
        {
            icon: <Shield className="feature-icon" />,
            title: "Безпека даних",
            description: "Надійний захист інформації та контроль доступу до системи"
        },
        {
            icon: <BarChart className="feature-icon" />,
            title: "Аналітика",
            description: "Детальна статистика та звіти для прийняття обґрунтованих рішень"
        }
    ];

    return (
        <Container className="py-5">
            {/* Hero секція */}
            <Row className="mb-5 align-items-center">
                <Col lg={6} className="mb-4 mb-lg-0">
                    <h1 className="display-4 fw-bold mb-4">
                        TrackTara - Система управління тарою
                    </h1>
                    <p className="lead text-muted mb-4">
                        Сучасне рішення для ефективного управління тарою та контейнерами. 
                        Оптимізуйте процеси, зберігайте контроль та покращуйте ефективність 
                        вашого бізнесу.
                    </p>
                    {!isAuthenticated && (
                        <div className="d-flex gap-3">
                            <Link to="/login">
                                <Button variant="primary" size="lg">
                                    Увійти
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline-primary" size="lg">
                                    Зареєструватися
                                </Button>
                            </Link>
                        </div>
                    )}
                </Col>
                <Col lg={6}>
                    <img 
                        src="/image-removebg-preview.png" 
                        alt="TrackTara Logo" 
                        className="img-fluid rounded-3 shadow-sm"
                        style={{ maxHeight: '300px' }}
                    />
                </Col>
            </Row>

            {/* Особливості системи */}
            <Row className="mb-5">
                <Col className="text-center mb-4">
                    <h2 className="fw-bold">Можливості системи</h2>
                    <p className="text-muted">Всі необхідні інструменти для ефективного управління</p>
                </Col>
            </Row>
            <Row className="g-4">
                {features.map((feature, index) => (
                    <Col key={index} md={6} lg={3}>
                        <Card className="h-100 border-0 shadow-sm hover-card">
                            <Card.Body className="p-4">
                                <div className="feature-icon-wrapper mb-3">
                                    {feature.icon}
                                </div>
                                <h3 className="h5 fw-bold mb-3">{feature.title}</h3>
                                <p className="text-muted mb-0">{feature.description}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Call to Action */}
            {!isAuthenticated && (
                <Row className="mt-5">
                    <Col className="text-center">
                        <Card className="border-0 bg-light">
                            <Card.Body className="p-5">
                                <h2 className="fw-bold mb-3">Готові почати?</h2>
                                <p className="lead text-muted mb-4">
                                    Приєднуйтесь до системи TrackTara вже сьогодні та оптимізуйте 
                                    процеси управління тарою у вашому бізнесі.
                                </p>
                                <Link to="/register">
                                    <Button variant="primary" size="lg" className="d-inline-flex align-items-center gap-2">
                                        Створити обліковий запис
                                        <ArrowRight size={20} />
                                    </Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default HomePage;