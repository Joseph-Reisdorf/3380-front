import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';
import { Button, TextField, Card, Grid, Box, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const PlaylistPage = () => {
    const { loggedIn, userId, userRole, loading } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylist, setNewPlaylist] = useState('');
    const [addingPlaylist, setAddingPlaylist] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !loggedIn) {
            navigate('/login');
        } else if (!loading && userRole !== 'a' && userRole !== 'l') {
            navigate('/');
        }
    }, [loggedIn, userRole, loading, navigate]);

    useEffect(() => {
        if (!loading && userId) {
            fetchPlaylistsAndTracks();
        }
    }, [userId, loading]);

    const fetchPlaylistsAndTracks = async () => {
        try {
            const playlistRes = await axios.get(`${process.env.REACT_APP_BACK_URL}/playlists/get_playlists_by_listener_id/${userId}`);
            console.log('Fetched playlists:', playlistRes.data);
            const playlists = playlistRes.data;

            const tracksPromises = playlists.map(playlist =>
                axios.get(`${process.env.REACT_APP_BACK_URL}/playlists/get_tracks_by_playlist_id/${playlist.playlist_id}`)
            );

            const tracksResponses = await Promise.all(tracksPromises);
            console.log('Fetched tracks for playlists:', tracksResponses.map(res => res.data));

            const playlistsWithTracks = playlists.map((playlist, index) => ({
                ...playlist,
                tracks: tracksResponses[index].data
            }));

            setPlaylists(playlistsWithTracks);
        } catch (error) {
            console.error('Error loading playlists and tracks:', error);
        }
    };

    const handleAddPlaylist = () => {
        setAddingPlaylist(!addingPlaylist);
    };

    const handlePost = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACK_URL}/playlists/add_playlist`, {
                playlist_name: newPlaylist,
                listener_id: userId
            });
            console.log('Posted new playlist:', res.data);
            fetchPlaylistsAndTracks(); // Refresh playlists after adding
        } catch (error) {
            console.error('Error posting new playlist:', error);
        }
    };

    const handlePlay = (trackId) => {
        console.log('Playing track:', trackId);
    };
    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Your Playlists
                <Button variant="contained" color="primary" onClick={handleAddPlaylist} sx={{ mb: 2, ml: 2 }}>
                    {addingPlaylist ? 'Cancel' : 'Add Playlist'}
                </Button>
            </Typography>
            {addingPlaylist && (
                <form onSubmit={handlePost} sx={{ marginBottom: 2 }}>
                    <TextField
                        label="Playlist Name"
                        variant="outlined"
                        onChange={e => setNewPlaylist(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 1, mb: 2 }}>
                        Create
                    </Button>
                </form>
            )}
            <Grid container spacing={2}>
                {playlists.map((playlist) => (
                    <Grid item xs={12} sm={6} key={playlist.playlist_id}>
                        <Card elevation={3} sx={{
                            '&:hover': {
                                boxShadow: 6
                            }
                        }}>
                            <CardContent>
                                <Typography variant="h5">{playlist.playlist_name}</Typography>
                                <Typography color="textSecondary" sx={{ mb: 2 }}>
                                    Created: {new Date(playlist.playlist_release_date).toLocaleDateString()}
                                </Typography>
                                <List>
                                    <Typography variant="h6">Tracks:</Typography>
                                    {playlist.tracks.map(track => (
                                        <ListItem key={track.track_id} sx={{
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow: 3
                                            },
                                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
                                        }}>
                                            <ListItemText primary={track.track_name} secondary={`Genre: ${track.genre_name}, Artist: ${track.artist_name}`} />
                                            <Button onClick={() => handlePlay(track.track_id)} variant="outlined" color="primary" sx={{ ml: 1 }}>
                                                Play
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PlaylistPage;