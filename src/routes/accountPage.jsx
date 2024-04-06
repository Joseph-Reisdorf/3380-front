import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Artist = () => {
  const { id } = useParams(); 
  const artistId = parseInt(id);
  const [artistData, setArtistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/find_artist_by_id/${artistId}`);
        setArtistData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div>
      <h2>Artist Details</h2>
      <div>
        <strong>Name:</strong> {artistData && artistData.artist_name}
      </div>
      <div>
        <strong>Biography:</strong> {artistData && artistData.artist_biography}
      </div>
      {/* Add any other artist details you want to display */}
    </div>
  );
};

export default Artist;
