import React, { useState, useEffect } from 'react';
import axios from "axios";

const MusicItem = ({ musicImage, musicTitle, artistName }) => {
  return (
    <div className="music-item">
      {/* <img src={musicImage} alt={musicTitle} className="music-image" /> */}
      <div className="music-info">
        <div className="music-title">{musicTitle}</div>
        <div className="artist-name">{artistName}</div>
      </div>
    </div>
  );
};

const Library = () => {
  const [music, setMusic] = useState([]);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}library/get_library`);
        setMusic(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMusic();
  }, []);

  return (
    <div className="library-container">
      {music.map((item, index) => (
        <MusicItem
          key={index}
         // musicImage={item.image}
          musicTitle={item.track_name}
          artistName={item.message}//change this later
        />
      ))}
    </div>
  );
};

export default Library;
