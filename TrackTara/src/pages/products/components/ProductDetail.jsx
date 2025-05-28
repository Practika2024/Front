import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../../store/state/actions/productActions";
import { useParams } from "react-router-dom";
import { Card, Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const product = useSelector((state) => state.product.product);
    const status = useSelector((state) => state.product.status);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProductById(productId));
    }, [dispatch, productId]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "failed") {
        return <div>Error loading product</div>;
    }

    return (
        <div className="container mt-5">
            <Card>
                <Card.Header>
                    <h2>Деталі продукту</h2>
                </Card.Header>
                <Card.Body>
                    {product && (
                        <div>
                            {/* Carousel for images */}
                            {product.images && product.images.length > 0 && (
                                <Carousel
                                    indicators={false}
                                    nextIcon={
                                        <span
                                            aria-hidden="true"
                                            className="carousel-control-next-icon"
                                            style={{ filter: "invert(1)" }}
                                        />
                                    }
                                    prevIcon={
                                        <span
                                            aria-hidden="true"
                                            className="carousel-control-prev-icon"
                                            style={{ filter: "invert(1)" }}
                                        />
                                    }
                                >
                                    {product.images.map((image) => (
                                        <Carousel.Item key={image.id}>
                                            <img
                                                className="d-block w-100"
                                                src={image.filePath}
                                                alt="Product"
                                                style={{
                                                    maxHeight: "300px",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            )}

                            <Card.Title className="mt-3">{product.name}</Card.Title>
                            <Card.Text>
                                <strong>Опис:</strong> {product.description}
                            </Card.Text>
                            <Card.Text>
                                <strong>Дата виробництва:</strong>{" "}
                                {new Date(product.manufactureDate).toISOString().split("T")[0]}
                            </Card.Text>

                            <Button
                                variant="primary"
                                onClick={() => navigate(`/product/update/${product.id}`)}
                                style={{ marginRight: '10px' }}
                            >
                                Змінити
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate("/products")}
                                style={{ borderWidth: '2px' }}
                            >
                                Назад до списку
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ProductDetail;