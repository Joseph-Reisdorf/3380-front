import React, { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css"; 
import axios from 'axios';

function Player({ playlist }) {
  const [currentTrack, setTrackIndex] = useState(0);
  const [blobUrls, setBlobUrls] = useState([]);


  useEffect(() => {
    const fetchBlobUrls = async () => {
      const urls = await Promise.all(
        playlist.map(async (track) => {
          try {
  
            const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/${track.track_id}/blob`, {
              responseType: 'arraybuffer'
            });

            if (!response.data) {
              throw new Error('No track blob data received');
            }

    
            const blob = new Blob([response.data], { type: 'audio/mpeg' });
            const blobUrl = URL.createObjectURL(blob);
            console.log("Blob URL:", blobUrl); 
            return blobUrl;
          } catch (error) {
            console.error("Error fetching blob URL:", error);
            return null;
          }
        })
      );
      setBlobUrls(urls);
    };

    fetchBlobUrls();
  }, [playlist]);

  const handleClickNext = () => {
    setTrackIndex((currentTrack) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handleEnd = () => {
    setTrackIndex((currentTrack) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
  };

  console.log("Playlist:", playlist);
  console.log("Current Track Index:", currentTrack);

  if (!playlist || playlist.length === 0 || blobUrls.length === 0) {
    return <div>No tracks available</div>;
  }

  return (
    <div>
      <h1>Hello, audio player!</h1>
      <h2>{playlist[currentTrack].track_name}</h2>
      <AudioPlayer
        volume="0.5"
        src={blobUrls[currentTrack]} 
        showSkipControls
        autoPlay={false}
        onClickNext={handleClickNext}
        onEnded={handleEnd}
        onError={(e) => {
          console.error("Audio player error:", e);
        }}
        // Try other props!
      />
    </div>
  );
}

export default Player;
