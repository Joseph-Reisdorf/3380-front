import React, { useState, useEffect } from 'react';
import axios from "axios";

const AlbumCard = ({ albumImage, albumName, artistName }) => {
  return (
    <div className="album-card">
      {/* <img src={albumImage} alt={albumName} className="album-image" /> */}
      <div className="album-info">
        <div className="album-name">{albumName}</div>
        <div className="artist-name">{artistName}</div>
      </div>
    </div>
  );
};

const Album = () => {
  const [album, setAlbum] = useState([]);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}albums/get_albums`);
        setAlbum(res.data); // Use res.data instead of res.json()
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbum();
  }, []); // Dependency array to ensure it runs only once

  return (
    <div className="albums-container">
      {album.map((album, index) => (
        <AlbumCard
          key={index}
          albumImage={album.album_cover_art} // Uncomment and ensure the property name matches
          albumName={album.album_title}
          artistName={album.artist} // Uncomment and ensure the property name matches
        />
      ))}
    </div>
  );
};

export default Album;
