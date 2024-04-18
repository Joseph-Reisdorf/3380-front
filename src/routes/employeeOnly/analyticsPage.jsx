import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import GenreReportPage from './genreReportPage';
import ArtistListenerReportPage from './artstListenerReportPage';
import { useAuth } from '../../context/authContext';
import '../../styles/AnalyticsPage.css';

const AnalyticsPage = () => {
    const { loggedIn, userRole, loading } = useAuth();
    const navigate = useNavigate();

    const [showGenre, setShowGenre] = useState(false);
    const [showArtistListener, setShowArtistListener] = useState(false);

    // Handle showing Genre Report
    const handleShowGenre = () => {
        setShowGenre(true);
        setShowArtistListener(false);  // Ensure only one report is shown at a time
    };

    // Handle showing Artist/Listener Report
    const handleShowArtistListener = () => {
        setShowArtistListener(true);
        setShowGenre(false);  // Ensure only one report is shown at a time
    };

    useEffect(() => {
        if (!loading && loggedIn && (userRole !== 'e' && userRole !== 'x')) {
            navigate('/');  // Redirect if not authorized
        }
    }, [loggedIn, userRole, loading, navigate]);

    return (    
        <div>
            <h1>Analytics</h1>
            <div className='analytics-buttons-container'>
                <Button 
                    className="cool-button" 
                    variant="contained" 
                    style={{
                        backgroundColor: showGenre ? '#bd6f77' : '#6f9bc9', // custom colors using hex codes
                        color: '#fff' // setting text color to white
                    }}
                    onClick={handleShowGenre}>
                    Genre Report
                </Button>
                <Button 
                    className="cool-button" 
                    variant="contained" 
                    style={{
                        backgroundColor: showArtistListener ? '#bd6f77' : '#6f9bc9', // custom colors using hex codes
                        color: '#fff' // setting text color to white
                    }}
                    onClick={handleShowArtistListener}>
                    Artist/Listener Report
                </Button>
            </div>
            {showGenre && <GenreReportPage />}
            {showArtistListener && <ArtistListenerReportPage />}
        </div>

    );
};

export default AnalyticsPage;