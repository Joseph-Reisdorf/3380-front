
import { Link } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddPlaylistPopup from './addPlaylistPopup'; // Import the popup window component
import '../styles/Library.css'; // Import CSS file for styling

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/playlists`);
        setPlaylists(res.data);
      } catch (error) {
        console.error(error);
      } 
    };

    fetchPlaylists();
  }, []); 

  const handleAddPlaylistClick = () => {
    setShowPopup(true);
  };

  const handlePlaylistNameChange = (event) => {
    setPlaylistName(event.target.value);
  };

  return (
    <div className="library-container">
      <h1>Library</h1>
      {/* Render playlists */}
      {playlists.map((playlist) => (
        <div className="playlist" key={playlist.playlist_id}>
          <h3>Name: {playlist.playlist_name}</h3>
          <p>Release Date: {playlist.playlist_release_date}</p>
        </div>
      ))}

      {/* Button to trigger popup window */}
      <div className="add-playlist-button-container" onClick={handleAddPlaylistClick}>
        <span className="plus-sign">+</span>
      </div>

      {/* Popup window for adding a new playlist */}
      {showPopup && <AddPlaylistPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Library;
