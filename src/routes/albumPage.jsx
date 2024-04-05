// Album.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Player from './musicPlayer.jsx';

const Album = () => {
  const { id } = useParams(); 
  const albumId = parseInt(id);
  const [albumData, setAlbumData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [key, setKey] = useState(0); // Add key state

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/find_album_by_id/${albumId}`);
        setAlbumData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumData();
  }, [albumId]);

  useEffect(() => {
    // Update key whenever albumId changes
    setKey(prevKey => prevKey + 1);
  }, [albumId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div>
      <h2>Album Details</h2>
      <div>
        <strong>Title:</strong> {albumData && albumData.album_title}
      </div>
      <div>
        <strong>Description:</strong> {albumData && albumData.album_description}
      </div>
      <div>
        <strong>Songs:</strong>
        <ul>
          {albumData && albumData.tracks.map((song, index) => (
            <li key={index}>{song.track_name}</li>
          ))}
        </ul>
        {/* Pass key to Player component */}
        <Player key={key} playlist={albumData && albumData.tracks} />
      </div>
    </div>
  );
};

export default Album;
