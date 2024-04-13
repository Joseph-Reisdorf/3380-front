import React, { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";


const AddAlbumPage = () => {
    const { loggedIn, loading, userId } = useAuth();
    const [tracks, setTracks] = useState([]);
    
    const [album, setAlbum] = useState({
        album_primary_artist_id: userId,
        album_title: "",
        album_description: "",
        album_release_date: "",
        album_cover_art: ""
    });
    
    const handleChange = (e) => {
        if (e.target.name === "album_cover_art" && e.target.files.length > 0) {
            // Handle file input differently
            const file = e.target.files[0];
            const reader = new FileReader();
    
            reader.onloadend = () => {
                setAlbum({
                    ...album,
                    album_cover_art: reader.result
                });
            };
    
            reader.readAsDataURL(file); // Converts the file to a base64 string
        } else {
            setAlbum({
                ...album,
                [e.target.name]: e.target.value
            });
        }
    };    

    // Add album to database
    const handleClick = async e => {
        e.preventDefault();
        try {
            if (album.album_release_date === "") {
               album.album_release_date = null;
            }
            await axios.post(`${process.env.REACT_APP_BACK_URL}/albums/add_album`, album);

        } catch (err) {
            console.log(err);
        };
    };

    return (
        <div className='debug-add-person'>
            <h2>Add Album</h2>
            <form>
                    <div>
                        <label >Album Title:</label>
                        <input type="text" id="album_title" name="album_title" onChange={handleChange} required />
                    </div>
                    <div>
                        <label >Album Description:</label>
                        <textarea id="album_description" name="album_description" onChange={handleChange}></textarea>
                    </div>
                    <div>
                        <label >Release Date:</label>
                        <input type="date" id="album_release_date" name="album_release_date" onChange={handleChange} />
                    </div>
                    <div>
                        <label >Album Cover Art:</label>
                        <input type="file" id="album_cover_art" name="album_cover_art"  onChange={handleChange} accept="image/*"/>
                    </div>
                    
                    
                    <button type="submit" onClick={handleClick} >Submit</button>
                </form>
        </div>
        
    );
};

export default AddAlbumPage; 

