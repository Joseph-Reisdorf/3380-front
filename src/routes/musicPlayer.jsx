import React, { useState } from "react";
import ReactDOM from "react-dom";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'; // Import default styles

function Player() {
  const playlist = [
    { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' }, 
    { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  ];

  const PlayerApp = () => {
    const [currentTrack, setTrackIndex] = useState(0);

    const handleClickNext = () => {
      console.log('click next')
      setTrackIndex((currentTrack) =>
        currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
      );
    };
  
    const handleEnd = () => {
      console.log('end')
      setTrackIndex((currentTrack) =>
        currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
      );
    };

    return (
      <div className="container">
        <div className="centered-content">
          <h1>Hello, audio player!</h1>
          <AudioPlayer
            volume="0.5"
            src={playlist[currentTrack].src}
            showSkipControls
            onClickNext={handleClickNext}
            onEnded={handleEnd}
            onError={() => { console.log('play error') }}
            // Try other props!
          />
        </div>
      </div>
    );
  };

  ReactDOM.render(<PlayerApp />, document.getElementById("root"));
}

export default Player;
