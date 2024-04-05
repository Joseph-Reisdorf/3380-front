import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import '../styles/Nav.css';

function Nav({ loggedIn, isArtist }) {
  return (
    <nav>
      <ul className="navbar">
        <li><Link to="/" className="home">Home</Link></li>
        <li><Link to="/recents" className="recents">Recents</Link></li>
        <li><Link to="/library" className="library">Library</Link></li>
        <li><Link to="/playlists" className="playlist">Playlists</Link></li>
        <li><Link to="/albums" className="albums">Albums</Link></li>
        <li><Link to="/artists" className="artists">Artists</Link></li>

        <div className="search-container">
          <form action="/search">
            <input type="text" placeholder="Search.." name="search" />
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="icon-container">
          <Link to="/account" className="icon-link">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        
            <Link to="/artist_dashboard" className="artist-dashboard-link">
              Dashboard
            </Link>
          
          <Link to="/notifications" className="icon-link">
            <FontAwesomeIcon icon={faBell} />
          </Link>
        </div>
      </ul>
    </nav>
  );
}

export default Nav;
