import React, { memo } from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import CartItemsPage from "../pages/cartItems/CartitemsPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import ElectronicItemPage from "../pages/electronicItem/ElectronicItemPage";
import ProductDetailsPage from "../pages/electronicItem/components/productDetailsPage/ProductDetailsPage";
import ErrorPage from "../pages/errorPages/ErrorPage";
import FavoriteProductPage from "../pages/favoriteProducts/FavoriteProductPage";
import HomePage from "../pages/home/HomePage";
import ManufacturersPage from "../pages/manufacturers/ManufacturersPage";
import MyProfilePage from "../pages/myProfile/MyProfilePage";
import ProductPage from "../pages/products/ProductsPage";
import ProductEdit from "../pages/products/components/productEdit/ProductEdit";
import UsersPage from "../pages/users/UsersPage";
import ProtectedRoute from "./ProtectedRoute";
import ProductCreate from "../pages/products/components/productCreate/ProductCreate";

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
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <ProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit/:productId"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <ProductEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="create"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <ProductCreate />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/electronicItem">
            <Route index element={<ElectronicItemPage />} />
            <Route path=":categoryId" element={<ElectronicItemPage />} />
            <Route path="product/:productId" element={<ProductDetailsPage />} />
          </Route>

          <Route
            path="/cartItems"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <CartItemsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favoriteProducts"
            element={
              <ProtectedRoute allowedRoles={['User']}>
                <FavoriteProductPage />
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
            path="/categories"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manufacturers"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <ManufacturersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
});

export default BasicRoute;
