import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRoutes = ({ component: Component,user, ...props }) => {
    // const user = localStorage.getItem("token")
    console.log(user,Component)
    return user ? <Component {...props} /> : <Navigate to="/login" />;
};

export default AuthRoutes;
