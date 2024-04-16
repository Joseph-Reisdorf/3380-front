import React, {useEffect, useState} from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { usePlaylist } from "../context/playlistContext";
import { useNavigate } from "react-router-dom";


function Recents(){

    const { userId, loading, loggedIn, userRole } = useAuth();
    const [ startDate, setStartDate ] = useState(new Date());
    const [ endDate, setEndDate ] = useState(new Date());
    const [ recentTracks, setRecentTracks ] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && userId) {

            const fetchRecentTracks = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/listen_to/${userId}`);
                    setRecentTracks(res.data);
                    console.log(res.data);
                } catch (error) {
                    console.error("Error fetching recent tracks:", error);
                }
            };
            
            fetchRecentTracks();
        }
    }, [loggedIn, userId, loading]); 

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


    return(
    
        <div>
            <h1>Recents</h1>
            {recentTracks.length === 0 && <p>No recent tracks</p>}
            <ul>
                {recentTracks.map(track => (
                    <li >
                        {track.track_name} - {track.listen_to_datetime}
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default Recents;