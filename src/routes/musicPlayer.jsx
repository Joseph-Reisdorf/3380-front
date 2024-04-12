import React, { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import axios from 'axios';

function Player({ playlist }) {
  const [currentTrack, setTrackIndex] = useState(0);
  const [blobUrls, setBlobUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [track_id, setTrackId] = useState([]);
  // const [listenerId, setListenerId] = useState([]); 

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
            // handleRecents(track_id);
            return blobUrl;
          } catch (error) {
            console.error("Error fetching blob URL:", error);
            return null;
          }
        })
      );
      setBlobUrls(urls);
      setIsLoading(false); // Set loading state to false after fetching blob URLs
    };

    fetchBlobUrls();
  }, [playlist]);

  // const handleRecents = async () => {
  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/recents/add_recents`, {
  //       listen_to_listener_id: listenerId,
  //       listen_to_track_id: track_id
  //     });
  //     if (response.status === 200) {
  //     }
  //   } catch (err) {
  //     console.error('Error Adding Recents', err);
  //   }
  // };
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
        onEnded={handleEnd}
        onError={(e) => {
          console.error("Audio player error:", e);
        }}
        playing={false}
      />
    </div>
  );
}

export default Player;