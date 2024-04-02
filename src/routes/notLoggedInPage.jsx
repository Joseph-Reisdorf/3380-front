import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";


function NotLoggedIn() {
    const { loggedIn } = useAuth();
    
    return (
        <div className="home-content">

            <h1>It appears you are not logged in, and cannot access this page.</h1>
            
            <p>Click the link below to go somewhere permitted.</p>
            <Link to="/home">Home</Link>

        </div>
    );
}

export default NotLoggedIn;