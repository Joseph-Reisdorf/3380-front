import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import AddAlbumPage from './addAlbumPage';
import AddTrackPage from './addTrackPage';

const ArtistDashboardPage = () => {

    const { loggedIn, userId, userRole, loading } = useAuth();
    const [gotAlbums, setGotAlbums] = useState(false);
    const [addingAlbum, setAddingAlbum] = React.useState(false);
    const [addingTrack, setAddingTrack] = React.useState(false);


    const navigate = useNavigate();


    const [albums, setAlbums] = React.useState([]);
    const [artist, setArtist] = React.useState({});

    // If not an artist, redirect to login page
    useEffect(() => {
        if (!loading) {
            if (!loggedIn) {
                navigate('/login');
            }
            else if (userRole !== 'a') {
                navigate('/');
            }
        }

    }, [loggedIn, userRole, loading, navigate]); // Depend on isArtist to reactively navigate
  
    // get artist by id
    useEffect(() => {
        if (userId && loggedIn && !loading) {
            const fetchArtist = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/find_artist_by_id/${userId}`);
                    setArtist(res.data);
                } catch (error) {
                    console.error(error);
            }
            };
            fetchArtist();
        };  
    }, [userId, loggedIn, loading]);
    
    // get album list by primary_artist_id
    useEffect(() => {
        if (userId && loggedIn && !loading) {
            const fetchAlbums = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/find_albums_by_artist/${userId}`);
                    setAlbums(res.data);

                    setGotAlbums(true);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchAlbums();
        }

    }, [userId, loggedIn, loading]);

    // get tracks for each album
    useEffect(() => {
        if (albums.length > 0) {
            const fetchTracks = async () => {
                const albumsWithTracks = await Promise.all(albums.map(async (album) => {
                    try {
                        const trackRes = await axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/get_tracks_by_album/${album.album_id}`);
                        return { ...album, tracks: trackRes.data };  // Append tracks to the album object
                    } catch (error) {
                        console.error('Error fetching tracks for album:', album.album_id, error);
                        return { ...album, tracks: [] };  // Ensure tracks is an empty array if the fetch fails
                    }
                }));
                setAlbums(albumsWithTracks);  // Update the albums state with the new data
            };
            fetchTracks();
        }
    }, [gotAlbums]);
    /*useEffect(() => {
        const fetchTracks = async () => {
            const fetchTrackPromises = albums.map((album) =>
                axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/get_tracks_by_album/${album.album_id}`)
                    .then(trackRes => {
                        album.tracks = trackRes.data;
                    })
                    .catch(error => {
                        console.error('Error fetching tracks', error);
                        album.tracks = [];
                    })
                    
            );

            await Promise.all(fetchTrackPromises);
        };
        fetchTracks();
    }, [albums]);*/


    return (
        <div>
                <div>
                    <h1>Artist Dashboard - {artist && artist.artist_display_name}</h1>
                </div>

                { /* Display albums if there are any */ }
                <div>
                    <h2>Albums</h2>
                    <ul>
                        {albums.map((album) => (
                            <li key={album.album_id}>
                                <h3>{album.album_title}</h3>
                                <p>Description: {album.album_description}</p>
                                <p>Release Date: {album.album_release_date.slice(0, 10)}</p>
                                <p>Tracks:</p>
                                <ol>
                                    {album.tracks && album.tracks.map(track => (
                                        <li key={track.track_id}>{track.track_name}</li>
                                    ))}
                                </ol>
                            </li>
                        ))}
                    </ul>

                </div>

                { /* Conditionally rended based on button click */ }
                <div>
                    <button onClick={() => setAddingAlbum(!addingAlbum)}>Add Album</button>
                    <button onClick={() => setAddingTrack(!addingTrack)}>Add Track</button>
                </div>
                {addingAlbum && <AddAlbumPage />}
                {addingTrack && <AddTrackPage albums={albums} />}
        </div>

    );
}

export default ArtistDashboardPage;