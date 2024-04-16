import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';

const Album = () => {
  const { id } = useParams(); 
  const albumId = parseInt(id);

  const [album, setAlbum] = useState({});
  const [tracks, setTracks] = useState([]);

  const { loggedIn, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
        if (!loggedIn) {
            navigate('/login');
        }
        else if (userRole !== 'a') {
            if (userRole !== 'l') {  
                navigate('/');
            }
        }
    }
  }, [loggedIn, userRole, loading, navigate]); // Depend on isArtist to reactively navigate



  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/find_album_by_id/${albumId}`);
        setAlbum(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbum();
  }, [albumId]);

   // get tracks for each album
    useEffect(() => {
        const fetchTracks = async () => {
                try {
                    const trackRes = await axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/get_tracks_by_album/${albumId}`);
                    setTracks(trackRes.data);
                } catch (error) {
                    console.error('Error fetching tracks for album:', album.album_id, error);
                    return { ...album, tracks: [] };  // Ensure tracks is an empty array if the fetch fails
                }
            };

        fetchTracks();
        console.log(tracks);
    }, [albumId]);

  return (
    <div>
      <h2>Album Details</h2>
      <div>
        <strong>Title:</strong> {album.album_title}
      </div>
      <div>
        <strong>Description:</strong> {album.album_description}
      </div>
      <div>
        <strong>Songs:</strong>
        <ul>
          {tracks.length > 0 ? tracks.map((track, index) => (
            <li key={index}>{track.track_name}</li>
          )) : <li>No tracks available.</li>}
        </ul>
      </div>
    </div>
  )

};

export default Album;
