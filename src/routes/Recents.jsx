import React, {useEffect, useState} from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { usePlaylist } from "../context/playlistContext";


function Recents(){

    const { userId, loading } = useAuth();
    const [ startDate, setStartDate ] = useState(new Date());
    const [ endDate, setEndDate ] = useState(new Date());
    const [ recentTracks, setRecentTracks ] = useState([]);
    
    useEffect(() => {
        if (!loading && userId) {
            const fetchRecentTracks = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/listen_to/${userId}`);
                    setRecentTracks(res.data);
                } catch (error) {
                    console.error("Error fetching recent tracks:", error);
                }
            };
            fetchRecentTracks();
        }
    }, [userId, loading]); 

    return(
    
        <div>
            <h1>Recents</h1>

            <ul>
                {recentTracks.map(track => (
                    <li key={track.track_id}>
                        {track.track_name} 
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default Recents;