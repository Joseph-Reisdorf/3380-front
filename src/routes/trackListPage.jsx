import React, { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function TrackListPage(){

    const navigate = useNavigate();
    const { loggedIn } = useAuth();

    const [tracks, setTracks] = React.useState([]);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/track`);
                setTracks(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTracks();
    }, []);



    return(

        <div className='track-list-page'>
            <h1>Tracks</h1>
            <ul>
                {tracks.map((track) => (
                    <li key={track.track_id}>
                        <h3>{track.track_title}</h3>
                        <p>{track.track_release_date}</p>
                    </li>
                ))}
            </ul>
        </div>

    );
}

export default TrackListPage;