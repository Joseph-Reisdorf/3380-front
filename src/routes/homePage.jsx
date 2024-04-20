
import {React, useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { usePlaylist } from "../context/playlistContext";
import "../styles/homePage.css";
import PopUp from "./popUp";



function Home() {


  const [showPopup, setShowPopup] = useState(false); //For popup
  const [followerAlert, setFollowerAlert] = useState([]); 
  const [name, setName] = useState(null); //For popup
  const { loggedIn, userRole, userId, logout, loading } = useAuth();
  
  const getRoleName = (role) => {
    switch (role) {
      case 'a': return 'Artist';
      case 'l': return 'Listener';
      case 'e': return 'Employee';
      case 'x': return 'Admin';
      default: return '';
    }
  };
 
  useEffect(() => {
    if (!loading && loggedIn) {
      
      
      async function fetchName() {
        if (loggedIn && userId) {
          try {
            const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/debug_person/get_person_name_by_id/${userId}`);
            setName(res.data);
          } catch (err) {
            console.error("Failed to fetch artist name:", err);
          }
        }
      }
      fetchName();
    }
  }, [loggedIn, loading, userId]);

  useEffect(() => {
    async function fetchFollowerAlerts() {
      if (loggedIn && userId && userRole === 'a') {
        try {
          console.log("Getting follower alerts");
          const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/notifications/get_new_follower_alerts/${userId}`);
          
          if (res.data.length > 0) {
            console.log(followerAlert);
            setFollowerAlert(res.data);
            setShowPopup(true);
          }
        } catch (err) {
          console.error("Failed to fetch follower alerts:");
        }
      }
    }

    fetchFollowerAlerts();
  }, [loggedIn, loading, userId, userRole]); // Dependency array ensures this runs only on changes to these values

  const handleClosePopup = async (id) => {
    try {
      // API call to mark the alert as read or handled
      await axios.put(`${process.env.REACT_APP_BACK_URL}/notifications/mark_notification_as_seen/${id}`);
      // Filter out the alert from the state
      setFollowerAlert(currentAlerts => currentAlerts.filter(alert => alert.follower_alert_id !== id));
      if (followerAlert.length <= 1) {
        setShowPopup(false); // Only hide if last alert is being closed
      }
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  return (

    <div className="home-content">
      {followerAlert.length > 0 && followerAlert.map((alert) => {
        return (
          <PopUp 
            show={showPopup} 
            close={() => handleClosePopup(alert.follower_alert_id)}
            message={alert.follower_alert_message}
          >
          </PopUp>
        );
      })}
    
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


        {(loggedIn && name != null) &&
          <div >
            <p>Logged in as: <strong>{name.person_first_name} {name.person_last_name}</strong></p>
            <p>Role: <strong>{getRoleName(userRole)}</strong></p>
            <button className="logout-button" onClick={logout}>Logout</button>
          </div>
          }
      </div>

    </div>
  );
}

export default Home;
