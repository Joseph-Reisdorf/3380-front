import React, { useState, useEffect } from 'react'; 
import axios from "axios";

  

function ArtistDashboard() {
    const [notify, setNotify] = useState([]); 
  //const isArtist = useIsArtist(); 

  useEffect(() => {
    const fetchNotify = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/notifications/get_notifications`);
        setNotify(res.data);
      } catch (error) {
        console.error(error);
      } 
    };

    fetchNotify();
  }, []); 
  

  return (
    <div>
      <h1>Notifications</h1>
      {notify.map((a) => (
        <p>Congratulations {a.artist_display_name} for reaching {a.follow_count} followers!!!</p>
      ))}  
    </div>
  );
}

export default ArtistDashboard;

