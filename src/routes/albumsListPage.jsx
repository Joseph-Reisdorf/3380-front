import React, { useState, useEffect } from 'react'; // Simplified imports
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import AddAlbum from './addAlbumPage';
import { useIsArtist } from '../context/authInfo.mjs'; // Importing the useIsArtist hook

const Album = () => {

  const [album, setAlbum] = useState([]); 
  const isArtist = useIsArtist(); // Getting the user's role

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/get_albums`);
        setAlbum(res.data);
      } catch (error) {
        console.error(error);
      } 
    };

    fetchAlbum();
  }, []); // Dependency array added to ensure this effect runs only once

  return (
    <div>

{isArtist && ( // Conditionally render the link if user is an artist
        <div className='add-album'>
          <Link className="link" to="add_album">Add Album</Link>
          <Routes>
            <Route path="add_album" element={<AddAlbum />} />
          </Routes>          
        </div>
      )}
      <h1>Album</h1>
      {album.map((a) => (
        <div className="album" key={a.album_id}>
          <h3>Name: {a.album_title}</h3>
          <p>Release Date: {a.album_release_date}</p>
        </div>
      ))}

      
    </div>
  );
};

export default Album;
