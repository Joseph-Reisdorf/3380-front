import React, {useEffect, useState} from "react";
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

    const handlePlay = async (track) => {
        // Check if the play button is clicked directly, not triggered by the media player
        if (track.track_id !== currentTrack?.track_id) {
          try {
            await axios.post(
              "${process.env.REACT_APP_BACK_URL}/clicks/add_clicks/",{
                listen_to_listener_id: userId,
                listen_to_track_id: track.trackId
            }
            );
          } catch (error) {
            console.error("Error adding click:", error);
          }
          setCurrent(track);
        }
      };
    
    console.log(userId)
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