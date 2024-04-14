import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";




function LibraryPage(){
    const { userId, loading } = useAuth();

    const [tracks, setTracks] = useState([]);
    const [likedTracks, setLikedTracks] = useState([]);

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
    /*
    const handleLike = async (trackId) => {
        if (likedTracks.find(track => track.track_id === trackId)) {
            // Process unlike
            try {
                await axios.delete(`${process.env.REACT_APP_BACK_URL}/tracks/unlike/${trackId}`);
                
            } catch (error) {
                console.error("Error unliking track", trackId, error);
            }
        } else {
            // Process like
            try {
                await axios.post(`${process.env.REACT_APP_BACK_URL}/tracks/like/${trackId}`);
                // its not a fucking set dude
                l
            } catch (error) {
                console.error("Error liking track", trackId, error);
            }
        }
    };
    */
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