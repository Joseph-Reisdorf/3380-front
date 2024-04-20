import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

import { Card, CardContent, CardMedia, Typography, Grid, Container } from '@mui/material';

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
    const fetchAlbumsAndDetails = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/get_albums`);
        const albumsData = res.data;

        const albumsDetailsPromises = albumsData.map(async (album) => {
          const [tracksRes, coverRes, artistRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/get_tracks_by_album/${album.album_id}`),
            axios.get(`${process.env.REACT_APP_BACK_URL}/albums/cover/${album.album_id}`, { responseType: 'blob' })
          ]);

          return {
            ...album,
            tracks: tracksRes.data,
            coverUrl: URL.createObjectURL(coverRes.data)
          };
        });

        const albumsCompleteDetails = await Promise.all(albumsDetailsPromises);
        setAlbums(albumsCompleteDetails);
        console.log(albums);
      } catch (error) {
        console.error('Failed to fetch albums and their details', error);
      }
    };

    fetchAlbumsAndDetails();

  }, []);
 
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Albums
      </Typography>
      <Grid container spacing={4}>
        {albums.map(album => (
          <Grid item key={album.album_id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {album.album_title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Release Date: {album.album_release_date.slice(0,10 )}
                </Typography>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Tracks: {album.artist_display_name}
                    </Typography>
                    {album.tracks.length > 0 ? (album.tracks.map(track => (
                      <Typography key={track.track_id} variant="body2" color="textSecondary" component="p">
                        {track.track_name}
                      </Typography>
                    ))) : <Typography variant="body2" color="textSecondary" component="p">No tracks found</Typography>}
                  </CardContent>
                </Card>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Album;