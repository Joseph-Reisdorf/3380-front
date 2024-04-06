import React, { useState, useEffect } from 'react'; 
import axios from "axios";
import { useIsArtist } from '../context/authInfo.mjs'; 

const Album = () => {
  const [album, setAlbum] = useState([]); 
  const isArtist = useIsArtist(); 

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
          <p>Likes: {a.album_like_count}</p>
        </div>
      ))}

      
    </div>
  );
};

export default Album;
