import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Player from './musicPlayer.jsx';
import { useAuth } from '../context/authContext.mjs';

const Album = () => {
  const { id } = useParams(); 
  const albumId = parseInt(id);
  const [albumData, setAlbumData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [key, setKey] = useState(0);
  const { loggedIn, userRole, listenerId } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

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
    setKey(prevKey => prevKey + 1);
  }, [albumId]);

  useEffect(() => {
    const fetchDataAndListen = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/find_album_by_id/${albumId}`);
        setAlbumData(response.data);
  
        // Update listen_to table if logged in as a listener
        if (loggedIn && userRole === 'l' && listenerId) {
          await axios.post(`${process.env.REACT_APP_BACK_URL}/albumClicks/add_clicks`, {
            listen_to_listener_id: listenerId,
            listen_to_album_id: albumId
          });
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDataAndListen();
  }, [albumId, listenerId, loggedIn, userRole]);
  

  const updateLikeCount = async (albumId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/like/updateLike`, {
        albumId: albumId
      });
      if (response.status === 200) {
        console.log('Like count updated successfully.');
      }
    } catch (err) {
      console.error('Error updating like count:', err);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/like/add_like`, {
        listener_id: listenerId,
        album_id: albumId
      });
      if (response.status === 200) {
        setIsLiked(true);
        await updateLikeCount(albumId);
      }
    } catch (err) {
      console.error('Error liking album:', err);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/like/unLike`, {
        listener_id: listenerId,
        album_id: albumId
      });
      if (response.status === 200) {
        setIsLiked(false);
        await updateLikeCount(albumId);
      }
    } catch (err) {
      console.error('Error unliking album:', err);
    }
  };

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
        <strong>Likes:</strong> {albumData && albumData.album_like_count}
      </div>
      <div>
        <strong>Songs:</strong>
        <ul>
          {albumData && albumData.tracks.map((song, index) => (
            <li key={index}>{song.track_name}</li>
          ))}
        </ul>
        <Player key={key} playlist={albumData && albumData.tracks} />
      </div>
      {loggedIn && userRole === 'l' && (
        <div>
          {isLiked ? (
            <button onClick={handleUnlike}>Unlike</button>
          ) : (
            <button onClick={handleLike}>Like</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Album;
