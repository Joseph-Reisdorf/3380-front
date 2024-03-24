import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:8080/user_auth', {
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
            const response = await axios.post('http://localhost:8080/login', { username, password });
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
};