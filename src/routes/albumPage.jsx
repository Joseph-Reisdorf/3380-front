import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

const Album = () => {
  const { id } = useParams(); 
  const albumId = parseInt(id);

  const [album, setAlbum] = useState([]);
  //const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/find_album_by_id/${albumId}`);
        setAlbum(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbum();
  }, [albumId]);


  return (
    <div>
      <h2>Album Details</h2>
      <div>
        <strong>Title:</strong> {album.album_title}
      </div>
      <div>
        <strong>Description:</strong> {album.album_description}
      </div>
      <div>
        <strong>Songs:</strong>
      </div>
    </div>
  )

};

export default Album;
