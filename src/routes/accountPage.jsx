import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useIsArtist } from '../context/authInfo.mjs';
import { useAuth } from '../context/authContext.mjs';
import { useNavigate } from 'react-router-dom';

const Artist = () => {
  const isArtist = useIsArtist();
  const { loggedIn, listenerId } = useAuth();
  const [artistData, setArtistData] = useState(null);
  const [editedBiography, setEditedBiography] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is enabled
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        if (loggedIn && isArtist) {
          const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/find_artist_by_id/${listenerId}`);
          setArtistData(response.data);
          setEditedBiography(response.data.artist_biography); // Initialize editedBiography state with the current biography
        } else {
          navigate('/login');
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [listenerId, isArtist, loggedIn, navigate]);

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleSaveClick = async () => {
    try {
      // Send a request to update the biography
      await axios.put(`${process.env.REACT_APP_BACK_URL}/add_biography`, {
        artistId: artistData.artist_id,
        artist_biography: editedBiography
      });
      // Disable editing mode after successful update
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating biography:', error);
      // Handle error
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div>
      <h2>Account Details</h2>
      <div>
        <strong>Name:</strong> {artistData && artistData.artist_display_name}
      </div>
      <div>
        <strong>Biography:</strong> {isEditing ? (
          <input
            type="text"
            value={editedBiography}
            onChange={(e) => setEditedBiography(e.target.value)}
          />
        ) : (
          artistData && artistData.artist_biography
        )}
      </div>
      <div>
        {isEditing ? (
          <button onClick={handleSaveClick}>Save</button>
        ) : (
          <button onClick={handleEditClick}>Edit Biography</button>
        )}
      </div>
      <div>
        <strong>Follow Count:</strong> {artistData && artistData.follow_count}
      </div>
    </div>
  );
};

export default Artist;
