import React, { useState } from 'react';

import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { loginAuth } = useAuth();


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [loginStatus, setLoginStatus] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page
        setErrMsg(''); // Reset error message

        const loginState = await loginAuth(username, password);

        if (loginState) {
            setLoginStatus(true);
            navigate('/');
        }
        else {
            setErrMsg('Login failed. Please check your credentials.');
        }
        /*
        try {
            const response = await axios.post("http://localhost:8080/login", {
                username,
                password
            }, {
                withCredentials: true // For handling cookies/session if your backend uses it
            });
            
            if (response.data.auth) {
                console.log('Logged in successfully');
                localStorage.setItem('token', response.data.token); // Store token in local storage
                setLoginStatus(true);
                navigate('/'); // Redirect to home page
            }
            else {
                setErrMsg('Login failed. Please check your credentials.');
                console.error('Login failed:', response.data);
            }
        } 
        catch (err) { // gets 401 code from backend
            setErrMsg('Login failed. Please check your credentials.');
            console.error('Login error:', err);
        } */
    };

    return (
        <div>
            <h2>Login</h2>
            {errMsg && <p className="error">{errMsg}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button onClick={handleLogin} type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;