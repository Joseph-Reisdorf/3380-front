import React, { useState, useEffect } from "react";
import axios from "axios"; 

const Recents = () => {
    const [recentTracks, setRecentTracks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/get_recents") 
            .then(response => {
                setRecentTracks(response.data); 
            })
            .catch(error => {
                console.error("Error fetching recent tracks:", error);
            });
    }, []);

    return (
        <div>
            <h2>Recent Tracks</h2>
            <ul>
                {recentTracks.map(track => (
                    <li key={track.id}>{track.name}{track.genre}</li> //gets track, name and genre property.
                ))}
            </ul>
        </div>
    );
};

export default Recents;