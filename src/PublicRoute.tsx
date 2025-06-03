import React from 'react';
import {Navigate} from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const token = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (token) {
        return <Navigate to="/dashboard/user" replace/>;
    }
    return <>{children}</>;
};


export default ProtectedRoute;
