import 'chart.js/auto'; // Необхідно для Chart.js
import React, { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

const HomePage = () => {
    const [containerData, setContainerData] = useState([]);


    // Формування даних для графіка
    const chartData = {
        labels: containerData.map(data => data.month),
        datasets: [
            {
                label: 'Кількість створених контейнерів',
                data: containerData.map(data => data.count),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <Container className="mt-5">
            <Row className="mb-4 text-center">
                <Col>
                    <h1>Панель управління контейнерами</h1>
                    <p>Тут ви можете слідкувати за всіма створеними контейнерами та їхніми оновленнями.</p>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Графік створення контейнерів за останній рік</Card.Title>
                            <Bar data={chartData} />
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Останні дії</Card.Title>
                            <ul>
                                <li>Створено новий контейнер: "Контейнер для молока"</li>
                                <li>Оновлено контейнер: "Пластикова тара для води"</li>
                                <li>Видалено контейнер: "Тара для сипучих продуктів"</li>
                            </ul>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Реклама</Card.Title>
                            <p>💡 *Потрібна якісна тара?* Перевірте наші нові пропозиції для зберігання продуктів!</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;