import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.idUser) {
            return <Navigate to="/login" replace />;
        }
        return children;
    } catch (error) {
        console.error("Error in protected route:", error);
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
