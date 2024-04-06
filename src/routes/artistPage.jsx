import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import { useAuth } from '../context/authContext.mjs'

const ArtistPage = () => {
  const { id } = useParams();
  const artistId = parseInt(id);
  const { loggedIn, userRole, listenerId } = useAuth();
  const [artistData, setArtistData] = useState(null);
  const [albumsData, setAlbumsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noAlbums, setNoAlbums] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artistResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/find_artist_by_id/${artistId}`);
        setArtistData(artistResponse.data);
      } catch (err) {
        setError(err);
      }
    }; 

    const fetchAlbums = async () => {
      try {
        const albumsResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/find_album_by_artist/${artistId}`);
        if (albumsResponse.data.length === 0) { 
          setNoAlbums(true);
        }  
        else {
          const albums = Array.isArray(albumsResponse.data) ? albumsResponse.data : [albumsResponse.data];
          setAlbumsData(albums);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNoAlbums(true);
        }
        else {
          setAlbumsData([]);
          setError(err);
        }
      }
    };

    const checkFollowStatus = async () => {
      try {
        if (loggedIn && userRole === 'l' && listenerId) {
          const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/follow/get_follow?listener_id=${listenerId}&artist_id=${artistId}`);
          setIsFollowing(response.data.some(follow => follow.artist_id === artistId));
        }
        
      } catch (err) {
        console.error('Error checking follow status:', err);
      }
    };

    setIsLoading(true);
    Promise.all([fetchArtist(), fetchAlbums(), checkFollowStatus()]).then(() => setIsLoading(false));
  }, [artistId, loggedIn, userRole, listenerId]);



  const updateFollowCount = async (artistId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/follow/updateFollow`, {
        artistId: artistId
      });
      if (response.status === 200) {
        console.log('Follow count updated successfully.');
      }
    } catch (err) {
      console.error('Error updating follow count:', err);
    }
  };

  
  const handleFollow = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/follow/add_follow`, {
        listener_id: listenerId,
        artist_id: artistId
      });
      if (response.status === 200) {
        setIsFollowing(true);
        // Update follow count
        await updateFollowCount(artistId);
      }
    } catch (err) {
      console.error('Error following artist:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/follow/unFollow`, {
        listener_id: listenerId,
        artist_id: artistId
      });
      if (response.status === 200) {
        setIsFollowing(false);
        // Update follow count
        await updateFollowCount(artistId);
      }
    } catch (err) {
      console.error('Error unfollowing artist:', err);
    }
  };



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Artist Details</h1>
      {artistData && (
        <>
          <div>Display Name: {artistData.artist_display_name}</div>
          <div>Bio: {artistData.artist_biography}</div>
        </>
      )}
      
      <h2>Albums</h2>

      {noAlbums && <div>No albums found for this artist</div>}
      {albumsData.map(album => (
        <div key={album.album_id}>
          <p>
            Title: <Link to={`/album/${album.album_id}`}>
              {album.album_title}
            </Link>
          </p>
          <p>Release Date: {album.album_release_date.slice(0, 10)}</p>
          <p>Description: {album.album_description}</p>
          <p>Likes: {album.album_like_count}</p>
        </div>
      ))}

      {loggedIn && userRole === 'l' && !isFollowing && (
        <button onClick={handleFollow}>Follow Artist</button>
      )}

      {loggedIn && userRole === 'l' && isFollowing && (
        <>
          <div>You are following this artist</div>
          <button onClick={handleUnfollow}>Unfollow Artist</button>
        </>
      )}
    </div>
  );
};

export default ArtistPage;
