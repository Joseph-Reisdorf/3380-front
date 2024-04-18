import React, { createContext, useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null); // Added userId state
    const [userRole, setUserRole] = useState(null); // Added userRole state

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token to get the user's role without making an additional request
                const decoded = jwtDecode(token);
                setLoggedIn(true);
                setUserId(decoded.id); // Set the user ID from the decoded token
                setUserRole(decoded.role); // Set the user role from the decoded token
            } catch (error) {
                console.error('Error decoding token or Auth error:', error);
                setLoggedIn(false);
                setUserId(null); // Ensure userId is reset if there's an error
                setUserRole(null); // Ensure userRole is reset if there's an error
            }
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const loginAuth = async (username, password) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/login`, { username, password });
            if (response.data.auth) {
                localStorage.setItem('token', response.data.token);
                setLoggedIn(true);
                const decoded = jwtDecode(response.data.token); // Decode the newly acquired token
                setUserRole(decoded.role); // Update the role upon successful login
                return true;
            }
        } catch (error) {
            console.error('Login error:', error);
        }
        return false;
    };



  

    const logout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setUserRole(null); // Reset role on logout
    };

    return (
        <AuthContext.Provider value={{ loggedIn, loginAuth, logout, loading, userId, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};

