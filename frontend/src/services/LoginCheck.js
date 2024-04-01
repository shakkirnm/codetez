import React from 'react'
import { Navigate } from "react-router-dom";

// If user not logged in redirects to login page
const LoginCheckRoute = ({ component: Component,user, ...props }) => {
    console.log(user,Component)
    // const token = localStorage.getItem("token")
    return (
        !user ? <Component {...props} /> : <Navigate to="/" />
    );
}

export default LoginCheckRoute