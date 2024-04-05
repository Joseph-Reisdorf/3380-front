import React, { useEffect, useState } from 'react';
import {  Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Axios from 'axios';

// routes
import Home from './routes/homePage';
import Recents from './routes/Recents';
import Library from './routes/library';
import Account from './routes/accountPage';
import Nav from './routes/Nav';
import LeftNavBar from './routes/leftNavBar';
import DebugDatabase from './routes/debugDatabasePage';
import ArtistPage from "./routes/artistPage"; 
import ArtistsPage from './routes/artistsPage';
import Album from './routes/albumPage';
import Albums from './routes/albumsListPage';
import Register from './routes/registerPage';
import Login from './routes/loginPage';

import ArtistDashboardPage from './routes/artistOnly/artistDashboardPage';
import ArtistLeftNavBar from './routes/artistOnly/ArtistLeftNavBar';

Axios.defaults.withCredentials = true;

export default function App() {
  
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);


  return (
    <div className='app'>
      {/* Conditionally render ArtistLeftNavBar for ArtistDashboardPage */}
      {currentPath === '/artist_dashboard' && <ArtistLeftNavBar />}
      {/* Conditionally render Nav for all pages except ArtistDashboardPage */}
      {currentPath !== '/artist_dashboard' && (
        <header className="App-header">
          <Nav />
        </header>
      )}

      {/* Conditionally render LeftNavBar for all pages except ArtistDashboardPage */}
      {currentPath !== '/artist_dashboard' && <LeftNavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="account" element={<Account />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/album/:id" element={<Album />} />
        <Route path="/recents" element={<Recents />} />
        <Route path="/library" element={<Library />} />
        <Route path="/debug-database/*" element={<DebugDatabase />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/artist_dashboard" element={<ArtistDashboardPage />} />
      </Routes>
    </div>
  );
}

