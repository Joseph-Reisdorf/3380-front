import React, { useState } from 'react';
import axios from 'axios';
import '../styles/addPlaylistPopup.css'; 


function AddPlaylistPopup({ onClose }) {
  const [playlistName, setPlaylistName] = useState('');
  const [listenerId, setListenerId] = useState('');
  const [trackIds, setTrackIds] = useState([]);

  const handleAddPlaylist = async () => {
    try {
      // Make a POST request to add the playlist
      await axios.post(`${process.env.REACT_APP_BACK_URL}/playlists`, {
        listener_id: listenerId,
        name: playlistName,
        tracks: trackIds
      });

      // Close the popup window
      onClose();
    } catch (error) {
      console.error('Error adding playlist:', error);
      // Handle error
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Add Playlist</h2>
        <form onSubmit={handleAddPlaylist}>
          {/* Playlist name input */}
          <label htmlFor="playlistName">Playlist Name:</label>
          <input type="text" id="playlistName" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} required />
          
          {/* Listener ID input */}
          <label htmlFor="listenerId">Listener ID:</label>
          <input type="text" id="listenerId" value={listenerId} onChange={(e) => setListenerId(e.target.value)} required />
          
          {/* Track IDs input (if multiple tracks can be added) */}
          {/* Implement functionality to add and remove track IDs */}
          
          {/* Submit button */}
          <button type="submit">Create Playlist</button>
        </form>
        {/* Close button */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default AddPlaylistPopup;
