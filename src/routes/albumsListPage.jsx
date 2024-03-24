import React, { useState, useEffect } from 'react'; // Simplified imports
import axios from "axios";

const Album = () => {
  const [album, setAlbum] = useState([]); // Simplified state initialization

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/albums/get_albums`);
        setAlbum(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbum();
  }, []); // Dependency array added to ensure this effect runs only once

  return (
    <div>
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