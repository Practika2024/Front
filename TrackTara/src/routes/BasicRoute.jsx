import React, {memo} from "react";
import {Route, Routes} from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import RoleHomeRedirect from "../components/RoleHomeRedirect";
import SalesDashboard from "../pages/sales/SalesDashboard.jsx";
import ClientsRoutesPage from "../pages/sales/ClientsRoutesPage.jsx";
import PackingStationPage from "../pages/packing/PackingStationPage.jsx";
import MyProfilePage from "../pages/myProfile/MyProfilePage";
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
import UpdateProduct from "../pages/products/components/modals/UpdateProduct.jsx";
import ProductTypesPage from "../pages/ProductTypesPage/ProductTypesPage.jsx"; // Import TareDetailPage
import CreateOrder from "../pages/orders/CreateOrder.jsx";
import CartRegistry from "../pages/carts/CartRegistry.jsx";
import BrakiMag from "../pages/brakimag/BrakiMag.jsx";
import HomePage from "../pages/home/HomePage.jsx";
import PendingRolePage from "../pages/pendingRole/PendingRolePage.jsx";

// eslint-disable-next-line react/display-name
const BasicRoute = memo(() => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route 
                        index 
                        element={
                            <ProtectedRoute allowedRoles={["Operator", "Administrator", "SalesManager"]}>
                                <RoleHomeRedirect/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/pending-role"
                        element={
                            <ProtectedRoute allowedRoles={["Guest"]}>
                                <PendingRolePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/warehouse/pick"
                        element={
                            <ProtectedRoute allowedRoles={["Operator", "Administrator"]}>
                                <HomePage/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/sales"
                        element={
                            <ProtectedRoute allowedRoles={["SalesManager", "Administrator"]}>
                                <SalesDashboard/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/sales/clients"
                        element={
                            <ProtectedRoute allowedRoles={["SalesManager", "Administrator"]}>
                                <ClientsRoutesPage/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/packing"
                        element={
                            <ProtectedRoute allowedRoles={["Operator", "Administrator"]}>
                                <PackingStationPage/>
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/products">
                        <Route
                            index
                            element={
                                <ProtectedRoute allowedRoles={["Operator", "Administrator", "SalesManager"]}>
                                    <ProductPage/>
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute allowedRoles={["Administrator"]}>
                                <UsersPage/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute allowedRoles={["Operator", "Administrator", "SalesManager"]}>
                                <MyProfilePage/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tare"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Operator"]}>
                                    <ContainersPage/>
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/product/detail/:productId"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Operator", "Administrator", "SalesManager"]}>
                                    <ProductDetail/>
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/product/add"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Operator"]}>
                                    <CreateProduct/>
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/product/update/:productId"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Operator"]}>
                                    <UpdateProduct/>
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/productType"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Administrator"]}>
                                    <ProductTypesPage/>
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/tare/update/:id"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Operator"]}>
                                    <UpdateContainer/>
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/tare/create"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Operator"]}>
                                    <CreateContainer/>
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/tare/detail/:containerId"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Operator"]}>
                                    <ContainerDetailPage/>
                                </ProtectedRoute>
                            }
                    /> {/* Add TareDetailPage route */}
                    <Route
                        path="/container/containerTypes"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Administrator"]}>
                                    <ViewContainerTypes/>
                                </ProtectedRoute>
                            }
                    /> {/* Add TareDetailPage route */}
                    <Route
                        path="/orders/create"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Administrator", "SalesManager"]}>
                                    <CreateOrder/>
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/carts/registry"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Administrator"]}>
                                    <CartRegistry/>
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/brakimag"
                        element=
                            {
                                <ProtectedRoute allowedRoles={["Administrator"]}>
                                    <BrakiMag/>
                                </ProtectedRoute>
                            }
                    />
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Route>
            </Routes>
        </>
    );
});

export default BasicRoute;