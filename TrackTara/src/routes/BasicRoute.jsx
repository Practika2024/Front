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
import FavoriteProductPage from "../pages/favoriteProducts/FavoriteProductPage";
import HomePage from "../pages/home/HomePage";
import ManufacturersPage from "../pages/manufacturers/ManufacturersPage";
import MyProfilePage from "../pages/myProfile/MyProfilePage";
import ProductPage from "../pages/products/ProductsPage";
import ProductEdit from "../pages/products/components/productEdit/ProductEdit";
import UsersPage from "../pages/users/UsersPage";
import ProtectedRoute from "./ProtectedRoute";
import ProductCreate from "../pages/products/components/productCreate/ProductCreate";
import ContainersPage from "../pages/tare/ContainersPage.jsx";
import CreateContainer from "../pages/tare/components/tareModals/CreateContainer.jsx";
import UpdateContainer from "../pages/tare/components/tareModals/UpdateContainer.jsx";
import ContainerDetailPage from "../pages/tare/components/tareModals/ContainerDetailPage.jsx";
import ViewContainerTypes from "../pages/containerTypes/ViewContainerTypes.jsx"; // Import TareDetailPage

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
                            <ProtectedRoute allowedRoles={["Operator"]}>
                                <CartItemsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/favoriteProducts"
                        element={
                            <ProtectedRoute allowedRoles={['Operator']}>
                                <FavoriteProductPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                                <UsersPage />
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
                            <ProtectedRoute allowedRoles={["Operator"]}>
                                <MyProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/tare" element={<ContainersPage />} />
                    <Route path="/tare/update/:id" element={<UpdateContainer />} />
                    <Route path="/tare/create" element={<CreateContainer />} />
                    <Route path="/tare/detail/:containerId" element={<ContainerDetailPage />} /> {/* Add TareDetailPage route */}
                    <Route path="/container/containerTypes" element={<ViewContainerTypes />} /> {/* Add TareDetailPage route */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </>
    );
});

export default BasicRoute;