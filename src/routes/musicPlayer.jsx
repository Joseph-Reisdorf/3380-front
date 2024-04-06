import React, { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import axios from 'axios';

function Player({ playlist }) {
  const [currentTrack, setTrackIndex] = useState(0);
  const [blobUrls, setBlobUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

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
            return blobUrl;
          } catch (error) {
            console.error("Error fetching blob URL:", error);
            return null;
          }
        })
      );
      setBlobUrls(urls);
      setIsLoading(false);
    };

    fetchBlobUrls();
  }, [playlist]);

  const handleClickNext = () => {
    setTrackIndex((currentTrack) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handleClickPrevious = () => {
    setTrackIndex((currentTrack) =>
      currentTrack > 0 ? currentTrack - 1 : playlist.length - 1
    );
  };

  const handleEnd = () => {
    setTrackIndex((currentTrack) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!blobUrls || blobUrls.length === 0) {
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
        onClickNext={handleClickNext}
        onClickPrevious={handleClickPrevious} 
        onEnded={handleEnd}
        onError={(e) => {
          console.error("Audio player error:", e);
        }}
        playing={isPlaying}
        onPlay={handlePlayPause}
        onPause={handlePlayPause}
      />
    </div>
  );
}

export default Player;
