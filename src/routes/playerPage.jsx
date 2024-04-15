import React, { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "../styles/Player.css";
import axios from 'axios';
import { usePlaylist } from "../context/playlistContext.mjs";
import { useAuth } from "../context/authContext.mjs";

function Player() {
  const { currentTrack, setCurrent } = usePlaylist();
  const [showPlayer, setShowPlayer] = useState(false);
  const [blobUrl, setBlobUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasBeenPlayed, setHasBeenPlayed] = useState(false);

  const { userId, loading } = useAuth();

  useEffect(() => {
    if (currentTrack) {
      setIsLoading(true); // Set loading true while fetching
      const fetchBlobUrl = async () => {

        try {
          const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/blob/${currentTrack.track_id}`, {
            responseType: 'arraybuffer'
          });

          if (!response.data) {
            throw new Error('No track blob data received');
          }

          const blob = new Blob([response.data], { type: 'audio/mpeg' });
          setBlobUrl(URL.createObjectURL(blob));
        } catch (error) {
          console.error("Error fetching blob URL:", error);
          setBlobUrl('');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBlobUrl();
    }
    return () => setHasBeenPlayed(false);
  }, [currentTrack]);

  const handlePlay = () => {
    if (!hasBeenPlayed) {
      setHasBeenPlayed(true);
      console.log(currentTrack.track_id); 
      
      if (!loading && userId) {
        axios.post(`${process.env.REACT_APP_BACK_URL}/tracks/listen_to/${currentTrack.track_id}/${userId}`)
          .then(() => {
            console.log("Track listened to");
          })
          .catch((error) => {
            console.error("Error listening to track:", error);
          });
      }
    }
  }


  if (isLoading) {
    return <div className="player-container">Loading...</div>;
  }

  if (!blobUrl) {
    return <div className="player-container">No track available</div>;
  }

  const handleClose = () => {
    setCurrent(null);
  }

  return (
    <div>
      {currentTrack && (
        <div className="player-container">
          <div className="player-bar">
            <h2 ><strong>{currentTrack.track_name}</strong> - {currentTrack.artist_display_name}</h2>
            <button onClick={handleClose}>Close</button>
          </div>
          <AudioPlayer
            volume="0.5"
            src={blobUrl}
            onPlay={handlePlay}
            showSkipControls={false} // Assuming no skipping if single track handling
            onError={(e) => {
              console.error("Audio player error:", e);
            }}
            playing={false}
          />
        </div>
      )}
    </div>
  );
}

export default Player;
