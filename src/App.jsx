import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import {
    jwtDecode
} from "jwt-decode";

import LoginPage
from "./pages/LoginPage";

import DashboardPage
from "./pages/DashboardPage";

import CreateTicketPage
from "./pages/CreateTicketPage";

import DispatcherPage
from "./pages/DispatcherPage";

import ProtectedRoute
from "./components/ProtectedRoute";

import TicketDetailsPage
from "./pages/TicketDetailsPage";

import RegisterPage
from "./pages/RegisterPage";

import ProfilePage
from "./pages/ProfilePage";

import UsersPage
from "./pages/UsersPage";

import NotificationsPage
from "./pages/NotificationsPage";


function getRole() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {
        return jwtDecode(token).role;
    } catch (error) {
        console.error(error);
        return null;
    }
}


function getHomePath(role) {

    if (role === "admin") {
        return "/users";
    }

    if (role === "dispatcher") {
        return "/dispatcher";
    }

    return "/dashboard";
}


function RoleRoute({
    children,
    roles
}) {

    const role = getRole();

    if (!role) {
        return <Navigate to="/" />;
    }

    if (!roles.includes(role)) {
        return <Navigate to={getHomePath(role)} />;
    }

    return children;
}


function App() {

    const token =
        localStorage.getItem("token");

    const role =
        getRole();

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        token
                            ? (
                                <Navigate
                                    to={getHomePath(role)}
                                />
                            )
                            : (
                                <LoginPage />
                            )
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <RoleRoute roles={["resident", "executor", "dispatcher"]}>
                                <DashboardPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-ticket"
                    element={
                        <ProtectedRoute>
                            <RoleRoute roles={["resident", "executor"]}>
                                <CreateTicketPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dispatcher"
                    element={
                        <ProtectedRoute>
                            <RoleRoute roles={["dispatcher"]}>
                                <DispatcherPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <RoleRoute roles={["admin"]}>
                                <UsersPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tickets/:id"
                    element={
                        <ProtectedRoute>
                            <RoleRoute roles={["resident", "executor", "dispatcher"]}>
                                <TicketDetailsPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <RoleRoute roles={["resident", "executor", "dispatcher"]}>
                                <ProfilePage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <RoleRoute roles={["resident", "executor", "dispatcher"]}>
                                <NotificationsPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
