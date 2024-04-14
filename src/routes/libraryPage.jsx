import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";




function LibraryPage(){

    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/tracks`);
                setTracks(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTracks();
    }, []);

    return(
        <div> 
            
            <div>
                <h2>Tracks</h2>
                <ul>
                    {tracks.length > 0 ? tracks.map((track, index) => (
                        <li key={index}>
                            <Link to={`/track/${track.track_id}`}>{track.track_name}</Link>
                        </li>
                    )) : <li>No tracks available.</li>}
                </ul>
            </div>
        </div>
    );
}

export default LibraryPage;
/*<div>
                <h2>Search</h2>

                <input type="text" placeholder="Search for a track..."/>
                <button>Search</button>
            </div> */