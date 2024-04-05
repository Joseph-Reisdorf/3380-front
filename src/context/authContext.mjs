import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); // Added userRole state
    const [listenerId, setListenerId] = useState(null);
    
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token to get the user's role without making an additional request
                const decoded = jwtDecode(token);
                setLoggedIn(true);
                setUserRole(decoded.role); // Set the user role from the decoded token
                setListenerId(decoded.listener_id);
            } catch (error) {
                console.error('Error decoding token or Auth error:', error);
                setLoggedIn(false);
                setUserRole(null); // Ensure userRole is reset if there's an error
                setListenerId(null);
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
                setListenerId(decoded.listener_id);
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
        setListenerId(null);
    };

    return (
        <AuthContext.Provider value={{ loggedIn, loginAuth, logout, loading, userRole, listenerId }}>
            {children}
        </AuthContext.Provider>
    );
};

/*import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${process.env.REACT_APP_BACK_URL}/user_auth`, { 
                headers: {
                    'x-access-token': token,
                },
            }).then((response) => {
                if (response.data.auth) {
                    setLoggedIn(true);
                    
                }
                else {
                    setLoggedIn(false);
                }
                setLoading(false);
            }).catch((error) => {
                console.error('Auth error:', error);
                setLoggedIn(false);
            }).finally(() => {
                setLoading(false);
            });
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
    };

    return (
        <AuthContext.Provider value={{ loggedIn, loginAuth, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};*/