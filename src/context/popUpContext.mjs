
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import

const AuthContext = createContext();

export const useAuth = () => {
    const [showPopup, setShowPopup] = useState(false); // State for controlling popup visibility
    
};
