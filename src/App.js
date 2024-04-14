import { React, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePlaylist } from './context/playlistContext.mjs';
import Axios from 'axios';

// routes
import Home from './routes/homePage';
import Recents from './routes/Recents';
import Library from './routes/libraryPage';
import Account from './routes/accountPage';
import Nav from './routes/Nav';
import DebugDatabase from './routes/debugDatabasePage';
import ArtistPage from "./routes/artistPage"; // change path
import ArtistsPage from './routes/artistsPage';
import Album from './routes/albumPage';
import Albums from './routes/albumsListPage';
import Register from './routes/registerPage';
import Login from './routes/loginPage';
import TrackListPage from './routes/trackListPage';
import Search from './routes/searchPage';
import Playlist from './routes/playlistPage';
import Player from './routes/playerPage';
import ArtistDashboardPage from './routes/artistOnly/artistDashboardPage';

Axios.defaults.withCredentials = true;

export default function App() {

  //const queryClient = new QueryClient();

  return (
    <div className='app'>
         
      <header className="App-header">{/*changing the Navbar to my Navbar... */}
          <Nav />
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracks" element={<TrackListPage />} />
        <Route path="account" element={<Account />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path ="/artist/:id" element={<ArtistPage />} />
        <Route path="/albums" element={<Albums />} />
        <Route path ="/album/:id" element={<Album />} />
        <Route path="/recents" element={<Recents />} />
        <Route path="/library" element={<Library />} />
        <Route path="/debug-database/*" element={<DebugDatabase />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/artist_dashboard/*" element={<ArtistDashboardPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/playlists" element={<Playlist />} />
        
      </Routes>

      <footer>
        <Player/>
      </footer>
    </div>
  );
}


