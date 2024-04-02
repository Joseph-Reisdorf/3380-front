
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsArtist } from '../../context/authInfo';
import { useAuth } from '../../context/authContext';
import ArtistLeftNavBar from './ArtistLeftNavBar';

const ArtistDashboardPage = ({ setShowArtistNavBar }) => {
  const isArtist = useIsArtist();
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  // If not logged in or not an artist, redirect to appropriate page
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else if (!isArtist) {
      navigate('/');
    }
  }, [isArtist, loggedIn, navigate]); // Depend on isArtist and loggedIn to reactively navigate

  useEffect(() => {
    setShowArtistNavBar(true); // Show artist left navbar when dashboard is mounted
    return () => setShowArtistNavBar(false); // Hide artist left navbar when dashboard is unmounted
  }, [setShowArtistNavBar]);

  return (
    <div>
      {/* Render Artist Left Nav Bar only if logged in and user is an artist */}
      {<ArtistLeftNavBar />}

      <div>
        <h1>Artist Dashboard</h1>
      </div>
    </div>
  );
};

export default ArtistDashboardPage;

export default ArtistDashboardPage;