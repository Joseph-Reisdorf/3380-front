import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { usePlaylist } from "../context/playlistContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography, List, ListItem, ListItemText, Modal, Box, FormControl, InputLabel, Select, MenuItem, Card, CardActions, Grid, CardContent } from "@mui/material";
import PlaylistModal from "./playlistModalComponent.jsx";
import '../styles/LibraryPage.css';

function LibraryPage() {
    const { userId, loading, userRole, loggedIn } = useAuth();
    const { currentTrack, setCurrent } = usePlaylist();
    const navigate = useNavigate();

    const [tracks, setTracks] = useState([]);
    const [likedTracks, setLikedTracks] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ playlist_id: '', track_id: '' });

    // Fetch tracks and user playlists
    useEffect(() => {
        if (!loading && userId) {
            axios.get(`${process.env.REACT_APP_BACK_URL}/tracks`)
                .then(res => setTracks(res.data))
                .catch(error => console.error(error));

            axios.get(`${process.env.REACT_APP_BACK_URL}/playlists/get_playlists_by_listener_id/${userId}`)
                .then(res => setUserPlaylists(res.data))
                .catch(error => console.error("Error fetching user playlists:", error));

            axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/liked/${userId}`)
                .then(res => setLikedTracks(res.data.map(track => track.track_id)))
                .catch(error => console.error("Error fetching liked tracks:", error));
        }
    }, [userId, loading]);

    // Handlers
    const handleLike = async (trackId) => {
        const isLiked = likedTracks.includes(trackId);
        const method = isLiked ? 'delete' : 'post';
        const url = `${process.env.REACT_APP_BACK_URL}/tracks/${isLiked ? 'unlike' : 'like'}/${trackId}/${userId}`;

        try {
            await axios[method](url);
            setLikedTracks(isLiked ? likedTracks.filter(id => id !== trackId) : [...likedTracks, trackId]);
        } catch (error) {
            console.error(`Error ${isLiked ? 'unliking' : 'liking'} track`, trackId, error);
        }
    };

    const handlePlay = (track) => {
        setCurrent(track);
    };

    const handleOpenModal = (track_id) => {
        setShowModal(true);
        setFormData({ ...formData, track_id: track_id });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ playlist_id: '', track_id: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_BACK_URL}/playlists/add_track/${formData.playlist_id}/${formData.track_id}`);
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const findTrackNameById = (trackId) => tracks.find(track => track.track_id === trackId)?.track_name || 'Track not found';

    return (
        <Box sx={{ margin: 4 }}>
            <Typography variant="h4" gutterBottom>Tracks</Typography>
            <Grid container spacing={2}>
                {tracks.length > 0 ? tracks.map((track) => (
                    <Grid item xs={12} sm={6} md={4}  key={track.track_id}>
                    <Card key={track.track_id} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h4">{track.track_name}</Typography>
                            <Typography variant="h6">{track.artist_display_name}</Typography>
                            <Typography variant="h6">{track.track_release_date.slice(0, 10)}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => handleLike(track.track_id)} >
                                {likedTracks.includes(track.track_id) ? 'Unlike' : 'Like'}
                            </Button>
                            <Button onClick={() => handlePlay(track)} color="primary">
                                Play
                            </Button>
                            <Button onClick={() => handleOpenModal(track.track_id)} >
                                Add to Playlist
                            </Button>
                        </CardActions>
                    </Card>
                    </Grid>
                )) : <ListItem><ListItemText primary="No tracks available." /></ListItem>}
            </Grid>        

            <Modal
                open={showModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Track to Playlist
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Track: <strong>{findTrackNameById(formData.track_id)}</strong>
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            <InputLabel>Playlist</InputLabel>
                            <Select
                                value={formData.playlist_id}
                                label="Playlist"
                                onChange={e => setFormData(currentFormData => ({ ...currentFormData, playlist_id: e.target.value }))}
                                required
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {userPlaylists.map(p => (
                                    <MenuItem key={p.playlist_id} value={p.playlist_id}>{p.playlist_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit" color="primary" sx={{ mt: 2 }}>Submit</Button>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
}

export default LibraryPage;

/*import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { usePlaylist } from "../context/playlistContext";
import PlaylistModal from "./playlistModalComponent.jsx";
import { useNavigate } from "react-router-dom";

function LibraryPage(){
    const { userId, loading, userRole, loggedIn } = useAuth();
    const { currentTrack, setCurrent } = usePlaylist();

    const [tracks, setTracks] = useState([]);
    const [likedTracks, setLikedTracks] = useState([]);

    const [userPlaylists, setUserPlaylists] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTracksAndArtists = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/tracks`);
                setTracks(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTracksAndArtists();
    }, []);


    useEffect(() => {
        if (!loading && userId) {
            const fetchUserPlaylists = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/playlists/get_playlists_by_listener_id/${userId}`);
                    setUserPlaylists(res.data);
                } catch (error) {
                    console.error("Error fetching user playlists:", error);
                }
            }
            fetchUserPlaylists();
        }
    }, [userId, loading]);

    useEffect(() => {
        if (!loading && userId) {
            const fetchLikedTracks = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/liked/${userId}`);
                    
                    setLikedTracks(res.data.map(track => track.track_id)); 
                } catch (error) {
                    console.error("Error fetching liked tracks:", error);
                }
            };
            fetchLikedTracks();
        }
    }, [userId, loading]); 
    
    const handleLike = async (trackId) => {
        const isLiked = likedTracks.includes(trackId);
        if (isLiked) {
            // Process unlike
            try {
                await axios.delete(`${process.env.REACT_APP_BACK_URL}/tracks/unlike/${trackId}/${userId}`);
                setLikedTracks(likedTracks.filter(id => id !== trackId)); 
            } catch (error) {
                console.error("Error unliking track", trackId, error);
            }
        } else {
            // Process like
            try {
                await axios.post(`${process.env.REACT_APP_BACK_URL}/tracks/like/${trackId}/${userId}`);
                setLikedTracks([...likedTracks, trackId]); 
            } catch (error) {
                console.error("Error liking track", trackId, error);
            }
        }
    };

    const handlePlay = (track) => {
        setCurrent(track);
    };

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState('');

    // Redirect if not artist or listener
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


    const handleOpenModal = (track_id) => {
        setShowModal(true);
        setFormData({ ...formData, track_id: track_id }); // Set track_id at the time of opening the modal
    };

    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        if (!showModal) {
            setFormData({ playlist_id: '', track_id: '' }); // Reset formData when modal is closed
        }
    }, [showModal]);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { playlist_id, track_id } = formData;
    
        try {
            await axios.post(`${process.env.REACT_APP_BACK_URL}/playlists/add_track/${playlist_id}/${track_id}`);
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };


    const findTrackNameById = (trackId) => {
        const track = tracks.find(track => track.track_id === trackId);
        return track ? track.track_name : 'Track not found';
    };

    
    return(
        <div> 
                <h2>Tracks</h2>
                <ul>
                    {tracks.length > 0 ? tracks.map((track) => (
                        <li key={track.track_id} >
                            <button
                                onClick={() => handleLike(track.track_id)}
                                style={{ marginRight: "10px" }}
                            >
                                {likedTracks.includes(track.track_id) ? 'Unlike' : 'Like'}
                            </button>

                            <button onClick={() => handlePlay(track)}
                                style={{ marginRight: "10px" }}>
                            Play
                            </button>


                            <button onClick={() => handleOpenModal(track.track_id)} className="button">Add to Playlist</button>
                            <PlaylistModal
                                show={showModal}
                                onClose={handleCloseModal}
                                onSubmit={handleSubmit} // Ensure onSubmit is wired up correctly
                                formData={formData}
                                setFormData={setFormData}
                            >
                                <p>Track: <strong>{findTrackNameById(formData.track_id)}</strong></p>
                                <form onSubmit={handleSubmit}>
                                    <label>Playlist:</label>
                                    <select
                                        name="playlist_id"
                                        value={formData.playlist_id || ''}
                                        onChange={e => setFormData(currentFormData => ({ ...currentFormData, playlist_id: e.target.value }))}
                                    >
                                        <option value="" disabled>Select Playlist</option>
                                        {userPlaylists.map((p) => (
                                            <option key={p.playlist_id} value={p.playlist_id}>{p.playlist_name}</option>
                                        ))}
                                    </select>
                                </form>
                            </PlaylistModal>

                            <Link to={`/track/${track.track_id}`}>{track.track_name}</Link>
                            <p>{track.track_release_date.slice(0, 10)}</p>
                            <p>{track.artist_display_name}</p>
                        </li>
                    )) : <li>No tracks available.</li>}
                </ul>

        </div>
    );
}

export default LibraryPage;
/*<div>
                <h2>Search</h2>

                <input type="text" placeholder="Search for a track..."/>
                <button>Search</button>
            </div> */