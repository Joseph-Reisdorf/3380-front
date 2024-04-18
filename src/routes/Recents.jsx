import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import '../styles/Recents.css'; // Ensure you have appropriate CSS styles defined
import { usePlaylist } from '../context/playlistContext';
function Recents() {
    const { userId, loading, loggedIn, userRole } = useAuth();
    const navigate = useNavigate();
    const [recentTracks, setRecentTracks] = useState([]);

    const { currentTrack, setCurrent } = usePlaylist();
    useEffect(() => {
        if (!loading && userId) {
            axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/listen_to/${userId}`)
                .then(res => {
                    setRecentTracks(res.data);
                })
                .catch(error => console.error("Error fetching recent tracks:", error));
        }

        if (!loading && !loggedIn) {
            navigate('/login');
        } else if (userRole !== 'a' && userRole !== 'l') {
            navigate('/');
        }
    }, [userId, loading, loggedIn, userRole, navigate]);

    const handlePlay = (track) => {
        // Implement functionality to play track
        setCurrent(track);
    };

    return (
        <div className="library-container">
            <Typography variant="h4" gutterBottom className="recents-title">
                Recent Tracks
            </Typography>
                <div classname='track-list'>
                {recentTracks.length > 0 ? recentTracks.map((track) => (
                    <Grid key={track.track_id}>
                        <Card className="track-item">
                            <CardContent>
                                <Typography variant="h5">{track.track_name}</Typography>
                                <Typography variant="body2">{new Date(track.listen_to_datetime).toLocaleDateString()}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => handlePlay(track)} color="primary">
                                    Play
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )) : <Typography >No recent tracks found.</Typography>}

                </div>
               
        </div>
    );
}

export default Recents;
