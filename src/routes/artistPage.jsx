import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, redirect } from "react-router-dom";

const ArtistPage = () => {
  const { id } = useParams();
  const artistId = parseInt(id);
  const [artistData, setArtistData] = useState(null);
  const [albumsData, setAlbumsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noAlbums, setNoAlbums] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artistResponse = await axios.get(`http://localhost:8080/artists/find_artist_by_id/${artistId}`);
        setArtistData(artistResponse.data);
      } catch (err) {
        setError(err);
      }
    };

    const fetchAlbums = async () => {
      try {
        const albumsResponse = await axios.get(`http://localhost:8080/albums/find_album_by_artist/${artistId}`);
        if (albumsResponse.data.length === 0) { 
          setNoAlbums(true);
        }  
        else {
          setAlbumsData(albumsResponse.data);
          // Adjusting here to handle both an array and a single object
          const albums = Array.isArray(albumsResponse.data) ? albumsResponse.data : [albumsResponse.data];
          setAlbumsData(albums);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNoAlbums(true);
        }
        else {
          setAlbumsData([]);
          setError(err);
        }
      }
    };

    setIsLoading(true);
    Promise.all([fetchArtist(), fetchAlbums()]).then(() => setIsLoading(false));
  }, [artistId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Artist Details</h1>
      {artistData && (
        <>
          <div>Display Name: {artistData.artist_display_name}</div>
          <div>Bio: {artistData.artist_biography}</div>
        </>
      )}
      
      <h2>Albums</h2>

      {noAlbums && <div>No albums found for this artist</div>}
      {console.log(albumsData)}
      {albumsData.map(album => (
        <div key={album.album_id}>
          <p>
            Title: <Link to={`/Album/${album.album_id}`}>
              {album.album_title}
            </Link>
          </p>
          <p>Release Date: {album.album_release_date.slice(0, 10)}</p>
          <p>Description: {album.album_description}</p>
        </div>
      ))}
    </div>
  );
};

export default ArtistPage;

/*import React from 'react';

import { useQuery } from "@tanstack/react-query";
import makeRequest from "axios";
import { useParams, Link } from "react-router-dom";

const Artist = () => {
  const { id } = useParams(); 
  const artistId = parseInt(id);

  const artistQuery = useQuery({
    queryKey: ["artist"], 
    queryFn: () => makeRequest.get(`http://localhost:8080/back_end/Artist/find/${artistId}`).then((res) => res.data)
  });

  const albumsQuery = useQuery({
    queryKey: ["albums"], 
    queryFn: () => makeRequest.get(`http://localhost:8080/back_end/Album/findByArtist/${artistId}`).then((res) => res.data)
  });

  const { data: artistData, isLoading: isArtistLoading, isError: isArtistError } = artistQuery;
  const { data: albumsData, isLoading: isAlbumsLoading, isError: isAlbumsError } = albumsQuery;

  if (isArtistLoading || isAlbumsLoading) return <div>Loading...</div>;
  if (isArtistError || isAlbumsError) return <div>Error fetching data</div>;

  return (
    <div>
      <h2>Artist Details</h2>
      <div>
        <strong>Email:</strong> {artistData.artist_email}
      </div>
      <div>
        <strong>Display Name:</strong> {artistData.artist_display_name}
      </div>
      <div>
        <strong>Bio:</strong> {artistData.artist_biography}
      </div>
      
      <h2>Albums</h2>
      {albumsData.map(album => (
        <div key={album.album_id}>
          <Link to={`/Album/${album.album_id}`}>
            {album.album_title}
          </Link>
        </div>
      ))}
    </div>
  )

};

export default Artist;*/