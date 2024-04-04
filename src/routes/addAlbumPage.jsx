import React, { useState } from "react";
import axios from "axios";

const AddAlbum = () => {
    const [album, setAlbum] = useState({
        album_primary_artist_id: "",
        album_title: "",
        album_description: "",
        album_genre: "",
        track_names: [], 
        track_files: [] 
    });

    const [errors, setErrors] = useState({}); 
    const [successMessage, setSuccessMessage] = useState(""); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "track_name") {
            const { index } = e.target.dataset;
            const updatedTrackNames = [...album.track_names];
            updatedTrackNames[index] = value;
            setAlbum({
                ...album,
                track_names: updatedTrackNames
            });
        } else {
            setAlbum({
                ...album,
                [name]: value
            });
        }

        if (name === 'album_genre') {
            if (!/^\d+$/.test(value)) {
                setErrors({ ...errors, [name]: 'Please enter a valid genre (must be a number).' });
            } else {
                setErrors({ ...errors, [name]: '' });
            }
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        const updatedTrackFiles = [...album.track_files]; 
        for (let i = 0; i < files.length; i++) {
            updatedTrackFiles.push(files[i]); 
        }
        setAlbum({
            ...album,
            track_files: updatedTrackFiles
        });
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("album_primary_artist_id", album.album_primary_artist_id);
            formData.append("album_title", album.album_title);
            formData.append("album_description", album.album_description);
            formData.append("album_genre", album.album_genre);
            album.track_names.forEach((name) => {
                formData.append("track_name", name);
            });
            album.track_files.forEach((file) => {
                formData.append("track", file);
            });

            await axios.post(`${process.env.REACT_APP_BACK_URL}/albums/add_album`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setSuccessMessage("Album Added!"); 

            setAlbum({
                album_primary_artist_id: "",
                album_title: "",
                album_description: "",
                album_genre: "",
                track_names: [],
                track_files: []
            });
            setErrors({}); 
        } catch (err) {
            console.log(err);
        }
    };

    const addTrackInput = () => {
        setAlbum({
            ...album,
            track_names: [...album.track_names, ""]
        });
    };

    const removeTrackInput = (index) => {
        const updatedTrackNames = [...album.track_names];
        updatedTrackNames.splice(index, 1);
        
        const updatedTrackFiles = [...album.track_files];
        updatedTrackFiles.splice(index, 1);
        
        setAlbum({
            ...album,
            track_names: updatedTrackNames,
            track_files: updatedTrackFiles
        });
    };

    return (
        <div className='add-album'>
            <form>
                <input type="text" placeholder="Primary Artist ID" onChange={handleChange} name="album_primary_artist_id" value={album.album_primary_artist_id} />
                <input type="text" placeholder="Album Title" onChange={handleChange} name="album_title" value={album.album_title} />
                <input type="text" placeholder="Description" onChange={handleChange} name="album_description" value={album.album_description} />
                <input type="text" placeholder="Genre" onChange={handleChange} name="album_genre" value={album.album_genre} />
                {errors.album_genre && <p style={{ color: 'red' }}>{errors.album_genre}</p>} 
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} 
                {}
                {album.track_names.map((trackName, index) => (
                    <div key={index}>
                        <input type="text" placeholder={`Track ${index + 1} Name`} onChange={handleChange} data-index={index} name="track_name" value={trackName} />
                        {album.track_files[index] && <p>File: {album.track_files[index].name}</p>}
                        <button type="button" onClick={() => removeTrackInput(index)}>Remove Track</button>
                    </div>
                ))}
                <input type="file" onChange={handleFileChange} name="track_file" multiple />
                <button type="button" onClick={addTrackInput}>Add Track</button>
                <button type="submit" onClick={handleClick}>Add Album</button>
            </form>
        </div>
    );
};

export default AddAlbum;