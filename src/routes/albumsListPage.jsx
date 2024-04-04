import React, { useState, useEffect } from 'react'; 
import axios from "axios";
import {Routes, Route, Link } from "react-router-dom";
import AddAlbum from './addAlbumPage';

const Album = () => {
  const [album, setAlbum] = useState([]); 

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
  }, []); 

  return (
    <div>
      <h1>Album</h1>
      {album.map((a) => (
        <div className="album" key={a.album_id}>
          <h3>Name: {a.album_title}</h3>
          <p>Release Date: {a.album_release_date}</p>
        </div>
      ))}

    <div className='add-album'>
            <Link className="link" to="add_album">Add Album</Link>
            <Routes>
                <Route path="add_album" element={<AddAlbum />} />
            </Routes>          
        </div>
    </div>
  );
};

export default Album;