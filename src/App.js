import { React, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Axios from 'axios';



// routes
import Home from './routes/homePage';
import Recents from './routes/Recents';
import Library from './routes/library';
import Account from './routes/accountPage';
import Nav from './routes/Nav';
import DebugDatabase from './routes/debugDatabasePage';
import ArtistPage from "./routes/artistPage"; // change path
import ArtistsPage from './routes/artistsPage';
import Album from './routes/albumPage';
import Albums from './routes/albumsListPage';
import Register from './routes/registerPage';
import Login from './routes/loginPage';
import Player from './routes/musicPlayer';
import AddAlbum from './routes/artistOnly/addAlbumPage';
import ArtistDashboardPage from './routes/artistOnly/artistDashboardPage';
import ArtistNotification from "./routes/artistOnly/notificationsPage";
import Popup from './routes/popUp';
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
          <Route path="account" element={<Account />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path ="/artist/:id" element={<ArtistPage />} />
          <Route path="/albums/*" element={<Albums />} />
          <Route path ="/album/:id" element={<Album />} />
          <Route path="/recents" element={<Recents />} />
          <Route path="/library" element={<Library />} />
          <Route path="/debug-database/*" element={<DebugDatabase />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/player" element={<Player />} />
          <Route path="/notifications" element={<ArtistNotification />} />
          <Route path="/artist_dashboard/*" element={<ArtistDashboardPage />} />
          <Route path="/artist_dashboard/add_album" element={<AddAlbum />} />
         
          
        </Routes>
    </div>
  );
}