import React, { useEffect } from 'react';
import { useNavigate, NavLink  } from 'react-router-dom';
import { useIsArtist } from '../../context/authInfo';
import { useAuth } from '../../context/authContext';
import '../../styles/ArtistLeftNavBar.css';

const ArtistLeftNavBar = () => {
  const isArtist = useIsArtist();
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthorized users
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else if (!isArtist) {
      navigate('/home'); // Or wherever you want to redirect unauthorized users
    }
  }, [loggedIn, isArtist, navigate]);

  // Render the artist left nav bar
  return (
     (
      <nav className="left-nav artist-left-nav">
        <ul>
          <li><NavLink to="/artist_dashboard" className="dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/artist_content" className="content">Content</NavLink></li>
          <li><NavLink to="/artist_analytics" className="analytics">Analytics</NavLink></li>
          <li><NavLink to="/artist_awards" className="awards">Awards</NavLink></li>
        </ul>
      </nav>
    )
  );
};

export default ArtistLeftNavBar;
