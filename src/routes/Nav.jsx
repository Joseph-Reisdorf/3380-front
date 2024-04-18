import React from 'react'; // ES6 js
import {Link} from 'react-router-dom'; //for the link when needed
import '../styles/Nav.css'; // Nav styling file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //for the user account icon and notifications icon
import { faUser, faBell } from '@fortawesome/free-solid-svg-icons'; //for the user account icon and notifications icon
//import logo from './houston_cougars_logo_secondary_20032603.png';
import { useAuth } from '../context/authContext.mjs'; //for the user account icon and notifications icon

function Nav(){

    const { loading, userRole } = useAuth();

    return(
        <nav>
            <ul className="navbar">
                <div className="nav-item">
                    <li><Link to="/" className="home">Home</Link></li>
                    {(userRole === 'l' || userRole === 'a') && (
                        <>
                        <li><Link to="/recents" className="recents">Recents</Link></li>
                        <li><Link to="/library" className="library">Library</Link></li>
                        <li><Link to="/playlists" className="playlist">Playlists</Link></li>
                        <li><Link to="/albums" className="albums">Albums</Link></li>
                        <li><Link to="/artists" className="artists">Artists</Link></li>
                        </>
                    )}
                    {(userRole === 'a') && (
                        <li><Link to="/artist_dashboard" className="artist_dashboard">Dashboard</Link></li>
                    )}
                    {(userRole === 'a' || userRole === 'l') && (
                        <>
                        <li><Link to="/employee_dashboard" className="employee_dashboard">Dashboard</Link></li>
                        <li><Link to="/analytics" className="departments">Analytics</Link></li>
                        </>
                    )}


                </div>
                
                <div className="nav-item">
                    <div className="search-container">
                        {(userRole === 'l' || userRole === 'a') && (
                            <>
                                <form action="/search">
                                <input type="text" placeholder="Search.." name="search"></input>
                                <button type="submit">Search</button>
                                </form>
        
                                {/*<Link to="/account" className="icon-link">
                                    <FontAwesomeIcon icon={faUser} />
                                </Link>*/}
                                <Link to="/notifications" className="icon-link">
                                    <FontAwesomeIcon icon={faBell} />
                            </Link>
                            </>
                            
                        )}
                        
                    </div>
                </div>
            </ul>
        </nav>
      
    );

};

export default Nav;