import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TotalSignups = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalListeners, setTotalListeners] = useState(0);
  const [listenerData, setListenerData] = useState([]);
  const [totalArtists, setTotalArtists] = useState(0);
  const [artistData, setArtistData] = useState([]);
  const [error, setError] = useState("");

  const handleFetchData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/get_total_signups`,
        { startDate, endDate }
      );
      const { totalListeners, listenerData, totalArtists, artistData } =
        response.data;
      setTotalListeners(totalListeners);
      setListenerData(listenerData);
      setTotalArtists(totalArtists);
      setArtistData(artistData);
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2>Total Signups</h2>
      <div>
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <button onClick={handleFetchData}>Fetch Data</button>
      {error && <p>{error}</p>}
      <h3>Total Listeners: {totalListeners}</h3>
      <ul>
        {listenerData.map((listener) => (
          <li key={listener.id}>
            {listener.username} - {listener.firstName} {listener.lastName}
          </li>
        ))}
      </ul>
      <h3>Total Artists: {totalArtists}</h3>
      <ul>
        {artistData.map((artist) => (
          <li key={artist.id}>
            {artist.displayName} - {artist.firstName} {artist.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TotalSignups;
