import React, { memo } from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import HomePage from "../pages/home/HomePage";
import ProductPage from "../pages/products/ProductsPage";
import UsersPage from "../pages/users/UsersPage";
import ProtectedRoute from "./ProtectedRoute";
import ContainersPage from "../pages/tare/ContainersPage.jsx";
import CreateContainer from "../pages/tare/components/tareModals/CreateContainer.jsx";
import UpdateContainer from "../pages/tare/components/tareModals/UpdateContainer.jsx";
import ContainerDetailPage from "../pages/tare/components/tareModals/ContainerDetailPage.jsx";
import ViewContainerTypes from "../pages/containerTypes/ViewContainerTypes.jsx";
import ProductDetail from "../pages/products/components/ProductDetail.jsx";
import CreateProduct from "../pages/products/components/modals/CreateProduct.jsx";
import ProductTypesPage from "../pages/ProductTypesPage/ProductTypesPage.jsx"; // Import TareDetailPage
import ProductEdit from "../pages/products/components/edit/ProductEdit.jsx";
import ApprovalRequestsPage from "../pages/users/components/usersModals/ApprovalRequestsPage.jsx"; // Import TareDetailPage
import EmailConfirmationPage from "../pages/users/components/usersModals/EmailConfirmationPage";

// Add this route
// eslint-disable-next-line react/display-name
const BasicRoute = memo(() => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/products">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["Operator"]}>
                  <ProductPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/product/update/:productId"
            element={
              <ProtectedRoute allowedRoles={["Operator", "Administrator"]}>
                <ProductEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email-confirmation"
            element={<EmailConfirmationPage />}
          />
          <Route
            path="/approval-requests"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <ApprovalRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tare"
            element={
              <ProtectedRoute allowedRoles={["Operator"]}>
                <ContainersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/detail/:productId"
            element={
              <ProtectedRoute allowedRoles={["Operator"]}>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/add"
            element={
              <ProtectedRoute allowedRoles={["Operator"]}>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productType"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <ProductTypesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tare/update/:id"
            element={
              <ProtectedRoute allowedRoles={["Operator"]}>
                <UpdateContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tare/create"
            element={
              <ProtectedRoute allowedRoles={["Operator"]}>
                <CreateContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tare/detail/:containerId"
            element={
              <ProtectedRoute allowedRoles={["Operator"]}>
                <ContainerDetailPage />
              </ProtectedRoute>
            }
          />{" "}
          {/* Add TareDetailPage route */}
          <Route
            path="/container/containerTypes"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <ViewContainerTypes />
              </ProtectedRoute>
            }
          />{" "}
          {/* Add TareDetailPage route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
});

export default BasicRoute;
