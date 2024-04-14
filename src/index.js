import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import  { AuthProvider } from './context/authContext';
import { PlaylistProvider } from './context/playlistContext'; 

import App from './App';

import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  <React.StrictMode>

  <AuthProvider>
      <BrowserRouter>
        <PlaylistProvider>
          <App />
        </PlaylistProvider>
      </BrowserRouter>

    </AuthProvider>
  </React.StrictMode>
);

