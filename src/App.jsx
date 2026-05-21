import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

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


function App() {

    const token =
        localStorage.getItem(
            "token"
        );

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        token
                            ? (
                                <Navigate
                                    to="/dashboard"
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

                            <DashboardPage />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-ticket"
                    element={
                        <ProtectedRoute>

                            <CreateTicketPage />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dispatcher"
                    element={
                        <ProtectedRoute>

                            <DispatcherPage />

                        </ProtectedRoute>
                    }
                />
				
				<Route
					path="/tickets/:id"
					element={
						<ProtectedRoute>

							<TicketDetailsPage />

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

                            <ProfilePage />

                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
