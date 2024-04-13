import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";

// albums passed from other page
const AddTrackPage = ( {albums} ) => {
    const { loggedIn, loading, userId } = useAuth();
    const [albumNames, setAlbumNames] = useState([]);
    const [file, setFile] = useState(null);

  
    const [track, setTrack] = useState({
        track_album_id: "",
        track_name: "",
        track_genre: "",
        track_release_date: "",
        track_mp3: "",
        track_primary_artist_id: "",
    });

    const handleChange = (e) => {

        setTrack({
            ...track,
            [e.target.name]: e.target.value
        });
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    
    
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (track.track_release_date === "") {
                track.track_release_date = null;
            }
            const formData = new FormData();

            // Append track details to formData
            formData.append('track_album_id', track.track_album_id);
            formData.append('track_name', track.track_name);
            formData.append('track_genre', track.track_genre);
            formData.append('track_release_date', track.track_release_date || null); // Handle null date
            formData.append('track_primary_artist_id', userId);
            
            // Check if a file is selected and append it to formData
            if (file) {
                formData.append('track_mp3', file, file.name);
            }

            try {
                console.log(formData);
                await axios.post(`${process.env.REACT_APP_BACK_URL}/tracks/add_track`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
            } catch (err) {
                console.log(err);
            };
            
        } catch (err) {
            console.log(err);
        };
    }

    return (
        <div className='debug-add-person'>
            <h2>Add Track</h2>
            {/* Dropdown menu for album selection */} 
            <form onSubmit={handleSubmit}>
                <div>
          
                    <label>Album:</label>
                    <select name="track_album_id" onChange={(e) => setTrack({...track, track_album_id: e.target.value})}>
                        <option value="" disabled selected>Select Album</option>
                        {albums.map((a) => (
                            <option value={a.album_id}>{a.album_title}</option>
                        ))}
                    </select>
                </div>
          
                <div>
                    <label >Name:</label>
                    <input type="text" name="track_name" onChange={handleChange} required/>
                </div>
                <div>
                    <label >Genre:</label>
                    <input type="number" name="track_genre" onChange={handleChange} required />
                </div>
                <div>
                    <label >Release Date:</label>
                    <input type="date" name="track_release_date" onChange={handleChange} required/>
                </div>
                <div>
                    <label> Mp3 File:</label>
                    <input type="file" name="track_mp3" onChange={handleFileChange} required/>
                </div>
                <button type="submit" >Add Track</button>
            </form >
        </div>
        
    );
};

export default AddTrackPage; 

