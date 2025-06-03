import {Navigate, Route, Routes} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './pages/login/LoginPage.tsx';
import DashboardPage from './pages/dashboard/DashboardPage.tsx';
import UserPage from './pages/dashboard/user/UserPage.tsx';
import MovementsPage from "./pages/dashboard/user/movements/MovementsPage.tsx";
import ReportsPage from "./pages/dashboard/user/reports/ReportsPage.tsx";
import AdminPage from "./pages/dashboard/admin/AdminPage.tsx";
import MaintenancesPage from "./pages/dashboard/user/maintenances/MaintenancesPage.tsx";
import PublicRoute from "./PublicRoute.tsx";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute><LoginPage/></PublicRoute>}/>
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage/>
                    </ProtectedRoute>
                }
            >
                <Route path="user" element={
                    <ProtectedRoute>
                        <UserPage/>
                    </ProtectedRoute>
                }>
                    <Route path="maintenances" element={<MaintenancesPage/>}/>
                    <Route path="movements" element={<MovementsPage/>}/>
                    <Route path="reports" element={<ReportsPage/>}/>
                </Route>
                <Route
                    path="admin"
                    element={
                        <ProtectedRoute>
                            <AdminPage/>
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
}

export default AppRoutes;
