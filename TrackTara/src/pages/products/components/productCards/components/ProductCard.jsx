import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ProductImage from "./ProductImage";
import DeleteProductModal from "../../modals/DeleteProductModal";
import { useRenderCount } from "../../../../../hooks/useRenderCount";

const ProductCard = React.memo(({ product }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const openDeleteModal = useCallback((id) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => setShowDeleteModal(false), []);

  const renderCount = useRenderCount();

  return (
    <div>
      <Card sx={{ width: 250 }}>
        <ProductImage images={product?.images} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <Link
              className="link-offset-2 link-underline link-underline-opacity-0"
              to={`edit/${product.id}`}
            >
              {product.name}
            </Link>
          </Typography>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button color="error" onClick={() => openDeleteModal(product.id)}>
            Delete
          </Button>
          <Button>
            <Link
              className="link-offset-2 link-underline link-underline-opacity-0"
              to={`edit/${product.id}`}
            >
              Edit
            </Link>
          </Button>
        </CardActions>
        <h5>Render count: {renderCount}</h5>
      </Card>

      <DeleteProductModal
        showModal={showDeleteModal}
        closeModal={closeDeleteModal}
        productId={selectedProductId}
      />
    </div>
  );
});

export default ProductCard;
