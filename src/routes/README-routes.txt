
This directory contains the files that are the pages displayed on the site.

* These files should be .jsx, and follow the same general format 

Examples:

--- page that makes no request ---
--- notice the React import and the return statement ---
--- In addition, make sure to follow this export format ---
--- You can import many pages from other files but try to keep one page export per file --
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import DebugAddPerson from './debugAddPersonPage';
import DebugGetPeople from './debugGetPeoplePage';

import '../styles/DebugDatabase.css';

const DebugDatabase = () => {
    return (
        <div className='debug-database'>
            <h1>Debug Database</h1>

            <Link className="link" to="get_people">Get people</Link>
            <Link className="link" to="add_person">Add person</Link>
            <Routes>
                <Route path="add_person" element={<DebugAddPerson />} />
                <Route path="get_people" element={<DebugGetPeople />} />
            </Routes>
        </div>
        
        
    );   
}

export default DebugDatabase;


--- Here is a page that makes authContext, which handles login requests on your behalf ---
--- Most useful you you will be the loggedIn state ---
import {React, useState} from "react";

import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

import "../styles/homePage.css";

function Home() {

  const { loggedIn, logout, loading } = useAuth();
  
  
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
          {loggedIn && <button className="logout-button" onClick={logout}>Logout</button>}
        </div>

    </div>
  );
}

export default Home;



--- Here is an example of a page that makes axios requests ---
--- Notice the way we access the url -> process.env.REACT_APP_BACK_URL ---
--- The rest of the format is like an f-string in python for ease of viewing the url ---
--- This is also a good example of how to use the useEffect hook to make a request ---
--- Don't be worried about putting procedural functions at the top of page, like where //* is ---
import React, { useEffect, UseState } from "react";
import axios from "axios";

import "../styles/DebugFetchPerson.css";

//* here you might define a function for a calculation, anything that is for ease of logic reading (like parsing info in a user form below, for ease of use/logic)
const DebugGetPeople = () => {

    const [person, setPerson] = React.useState([]);

    useEffect(() => {
        const fetchAllPerson = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/debug_person/get_people`);
                setPerson(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllPerson();
    }, []);


    return (
        <div className='debug-fetch-person'>
            {person.map((p) => (
                <div className="person" key={p.person_id}>
                    <h3>Name: {p.person_first_name} {p.person_middle_initial} {p.person_last_name}</h3>
                    <p>Email: {p.person_email}</p>
                    <p>Birthdate: {p.person_birthdate}</p>
                    <p>Address: {p.person_address}</p>
                </div>
            
            ))}
        </div>
    );
}

export default DebugGetPeople;