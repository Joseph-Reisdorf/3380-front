import React, { useState, useEffect } from 'react'; // Simplified imports
import axios from "axios";

const AlbumCard = ({ albumImage, albumName, artistName }) => {
  return (
    <div className="album-card">
      <img src={albumImage} alt={albumName} className="album-image" />
      <div className="album-info">
        <div className="album-name">{albumName}</div>
        <div className="artist-name">{artistName}</div>
      </div>
    </div>
  );
};


const Album = () => {
  const [album, setAlbum] = useState([]); // Simplified state initialization

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        //const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/get_albums`);
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/get_albums`);
        setAlbum(res.data);
      } catch (error) {
        console.error(error);
      } 
    };

    fetchAlbum();
  }, []); // Dependency array added to ensure this effect runs only once
  return (
    <div className="albums-container">
      {album.map((album, index) => (
        <AlbumCard
          key={index}
          //albumImage={album.album_cover_art}
          //albumImage={logo}
          albumName={album.album_title}
          //artistName={album.artist}
        />
      ))}
    </div>
  );
};

export default Album;






