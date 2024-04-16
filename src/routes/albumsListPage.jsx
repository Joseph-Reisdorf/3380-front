import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Album = () => {
  const [albums, setAlbums] = useState([]);
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

    const fetchAlbumsAndArtists = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/get_albums`);
        const albumsData = res.data;

        const fetchArtistPromises = albumsData.map((album) =>
          axios.get(`${process.env.REACT_APP_BACK_URL}/artists/find_artist_by_id/${album.album_primary_artist_id}`)
            .then(artistRes => {
              album.artistName = artistRes.data.artist_display_name; 
            })
            .catch(error => {
              console.error('Error fetching artist', error);
              album.artistName = 'Unknown Artist'; 
            
            })
        );

        await Promise.all(fetchArtistPromises); 
        
        setAlbums(albumsData); 
        
      } catch (error) {
        console.error('Failed to fetch albums', error);
      }
    };

    fetchAlbumsAndArtists();
  }, []);

  return (
    <div>
      <h1>Albums</h1>
      {albums.map((a) => (
        <div className="album" key={a.album_id}>
          <h3>Name: <Link to={`/album/${a.album_id}`}>{a.album_title}</Link></h3>
          <p>Release Date: {a.album_release_date}</p>
          <p>Artist: <Link to={`/artist/${a.album_primary_artist_id}`}>{a.artistName}</Link></p>
        </div>
      ))}
    </div>
  );
};

export default Album;