import {React, useState} from "react";

import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

import "../styles/homePage.css";




function Home() {

  const { loggedIn, userRole, logout, loading } = useAuth();
  
  const getRoleName = (role) => {
    if (role === 'a') {
      return 'Artist';
    } else if (role === 'l') {
      return 'Listener';
    } else if (role === 'e') {
      return 'Employee';
    } else if (role === 'x') {
      return 'Admin';
    }
  }
  
  if (loading) {
    return <div>Loading authentication state...</div>;
  }

  return (
    <div className="home-content">

      <h1>HOME</h1>
      <p>Welcome to our Online Music Library. The goal of this application is to create website that interacts with a mySQL database using React and Node.js. We have 5 main requirements for this application as specified by the Professor.</p>

      <p style={{color: 'red'}}>The (5) requrements are:</p>

      <ol>
        <li>User authentication for different user roles</li>
        <li>Data entry forms (to modify/add/delete data)</li>
        <li>Implement 2 mySQL triggers in the database</li>
        <li>Add 3 queries for data from mySQL</li>
        <li>Generate 3 data reports from the collected data</li>
      </ol>

      <p>In addition to this we are tasked with implementing the actual hosting of a platform similar to many online streaming services.</p>
      
      
        <div className="login-homepage"> 
          <p className="login-explain">Our website is made for artists of UH. To recieve the ability to be an artist you must be the owner of a @cougarnet.uh.edu or @uh.edu email domain. Listeners who wish to support UH artists may register with any email domain, and will given access to the music on the site.</p>

          {!loggedIn && (
            <div className="login-links">
              <Link className="login-link" to="/register">Register</Link>
              <Link className="login-link" to="/login">Login</Link>
            </div>
          )}
          {loggedIn && 
              <button className="logout-button" onClick={logout}>Logout</button>
          }
        {loggedIn && 
        <p className="login-explain">Logged in as <strong>{getRoleName(userRole)}</strong></p>}
        </div>
    </div>
  );
}

export default Home;
