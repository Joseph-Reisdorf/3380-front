// LeftNavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell } from '@fortawesome/free-solid-svg-icons';
import '../styles/leftNavBar.css';

function LeftNavBar() {
    return (
        <nav className="left-nav">
            <div className="nav-items">
                {/* Search box */}
                <div className="search-container">
                    <input type="text" placeholder="Search.." name="search" />
                    <button type="submit">Search</button>
                </div>
                {/* Home button */}
                <Link to="/" className="home">
                    <FontAwesomeIcon icon={faHome} />
                </Link>
                {/* Notification button */}
                <Link to="/notifications" className="notifications">
                    <FontAwesomeIcon icon={faBell} />
                </Link>
                {/* Library button */}
                <Link to="/library" className="library">
                    Library
                </Link>
            </div>
        </nav>
    );
}

export default LeftNavBar;
