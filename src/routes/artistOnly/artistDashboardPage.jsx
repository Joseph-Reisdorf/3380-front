import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import AddAlbumPage from './addAlbumPage';
import AddTrackPage from './addTrackPage';
import ClicksDashboard from './clicksDashboard';
import {
    Paper, Button, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination
} from '@mui/material';
const ArtistDashboardPage = () => {

    const { loggedIn, userId, userRole, loading } = useAuth();
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);
    const [followerCount, setFollowerCount] = useState(0);
    const [genres, setGenres] = useState([]);
    const [addingAlbum, setAddingAlbum] = useState(false);
    const [addingTrack, setAddingTrack] = useState(false);
    
    const [reportOrAlbum, setReportOrAlbum] = useState(false);
    
    const handleDeleteAlbum = (albumId) => {
        // Implement delete functionality here
        console.log(`Deleting album with ID: ${albumId}`);
        if (albumId) {
            axios.delete(`${process.env.REACT_APP_BACK_URL}/albums/delete_album/${albumId}`)
                .then(res => {
                    console.log(res.data);
                    // Update the albums state to reflect the change
                    setAlbums(prevAlbums => prevAlbums.filter(album => album.album_id !== albumId));
                })
                .catch(error => console.error('Error deleting album:', error));
        }
    };

    const handleDeleteTrack = (trackId) => {
        if (trackId) {
            axios.delete(`${process.env.REACT_APP_BACK_URL}/tracks/delete_track/${trackId}`)
                .then(res => {
                    console.log(res.data);
                    // Update the albums state to reflect the change
                    setAlbums(prevAlbums => prevAlbums.map(album => {
                        const updatedTracks = album.tracks.filter(track => track.track_id !== trackId);
                        return { ...album, tracks: updatedTracks };
                    }));
                })
                .catch(error => console.error('Error deleting track:', error));

        }
    };

    // Combined useEffect for authentication and data fetching
    useEffect(() => {
        if (loading) return; // Wait until loading is false to proceed

        if (!loggedIn || userRole !== 'a') {
            navigate(userRole !== 'a' ? '/' : '/login');
            return;
        }

        if (userId) {
            axios.get(`${process.env.REACT_APP_BACK_URL}/artists/find_artist_by_id/${userId}`)
                .then(res => {
                    const artist = res.data;
                    return axios.get(`${process.env.REACT_APP_BACK_URL}/albums/find_albums_by_artist/${userId}`);
                })
                .then(res => {
                    const albumsData = res.data;
                    return Promise.all(albumsData.map(album => 
                        axios.get(`${process.env.REACT_APP_BACK_URL}/tracks/get_tracks_by_album/${album.album_id}`)
                            .then(trackRes => ({ ...album, tracks: trackRes.data, page: 0, rowsPerPage: 5 }))
                            .catch(() => ({ ...album, tracks: [], page: 0, rowsPerPage: 5 }))
                    ));
                })
                .then(albumsWithTracks => {
                    setAlbums(albumsWithTracks);
                })
                .catch(error => console.error('Error loading data:', error));
            axios.get(`${process.env.REACT_APP_BACK_URL}/artists/get_artist_likes_count/${userId}`)
                .then(res => setFollowerCount(res.data.likes))
                .catch(error => console.error('Error loading follower count:', error));
            axios.get(`${process.env.REACT_APP_BACK_URL}/genres/get_genres`)
                .then(res => setGenres(res.data))
                .catch(error => console.error('Error loading genres:', error));
            
        }
    }, [userId, loggedIn, userRole, loading, navigate]);


    useEffect(() => {
        if (albums.length > 0) {
            console.log(albums);
        }
    }, [albums]);

    useEffect(() => {
        if (genres.length > 0) {
            console.log(genres);
        }
    }, [genres]);

    const handleChangePage = (event, newPage, albumId) => {
        setAlbums(prevAlbums =>
            prevAlbums.map(album =>
                album.album_id === albumId ? { ...album, page: newPage } : album
            )
        );
    };

    const handleChangeRowsPerPage = (event, albumId) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        setAlbums(prevAlbums =>
            prevAlbums.map(album =>
                album.album_id === albumId ? { ...album, rowsPerPage, page: 0 } : album
            )
        );
    };

    return (


        <Paper className="admin-dashboard-container">
            <Typography variant="h4" component="h1" className="dashboard-title">
                Artist Dashboard
            </Typography>
            <Typography variant="h6" component="h3" className="dashboard-subtitle">
                Follower Count: {followerCount || 0}
            </Typography>

            <Button onClick={() => setReportOrAlbum(!reportOrAlbum)} variant="contained" >
                {reportOrAlbum ? "Show Album Table" : "Plays Report"}
            </Button>
            
            {reportOrAlbum && <ClicksDashboard  />}

            {!reportOrAlbum  && (
            <TableContainer component={Paper} className='table'>
                <Table aria-label="albums table">
                    <TableHead className='thead'>
                        <TableRow>
                            <TableCell >Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Release Date</TableCell>
                            <TableCell>Tracks</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {albums.map((album) => (
                            <TableRow key={album.album_id} className='table-row'>
                                <TableCell>{album.album_title}</TableCell>
                                <TableCell>{album.album_description}</TableCell>
                                <TableCell>{album.album_release_date.slice(0, 10)}</TableCell>
                                <TableCell>
                                    <TableContainer component={Paper} className="table">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Track Name</TableCell>
                                                    <TableCell>Release Date</TableCell>
                                                    <TableCell>Genre</TableCell>
                                                    <TableCell>Delete</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {album.tracks.slice(album.page * album.rowsPerPage, (album.page + 1) * album.rowsPerPage).map(track => (
                                                    <TableRow key={track.track_id}>
                                                        <TableCell>{track.track_name}</TableCell>
                                                        <TableCell>{track.track_release_date.slice(0,10)}</TableCell>
                                                        
                                                        <TableCell>
                                                            {Array.isArray(genres) && genres.length > 0 ? (
                                                                genres.find(genre => genre.genre_id === track.track_genre)?.genre_name || 'Unknown Genre'
                                                            ) : (
                                                                track.track_genre || 'No Genre Info'
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button onClick={() => handleDeleteTrack(track.track_id)}>
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            rowsPerPageOptions={[3, 10]}
                                            component="div"
                                            count={album.tracks.length}
                                            rowsPerPage={album.rowsPerPage}
                                            page={album.page}
                                            onPageChange={(e, newPage) => handleChangePage(e, newPage, album.album_id)}
                                            onRowsPerPageChange={(e) => handleChangeRowsPerPage(e, album.album_id)}
                                        />
                                    </TableContainer>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleDeleteAlbum(album.album_id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            )}
            <div className='report-container'>
                <Button variant="contained" onClick={() => setAddingAlbum(!addingAlbum)} className="button">
                    Add Album
                </Button>
                <Button variant="contained" onClick={() => setAddingTrack(!addingTrack)} className="button">
                    Add Track
                </Button>
                {addingTrack && <AddTrackPage albums={albums} open={addingTrack} onClose={() => setAddingTrack(false)} />}
                {addingAlbum && <AddAlbumPage open={addingAlbum} onClose={() => setAddingAlbum(false)} />}
            </div>
        </Paper>

    );
};

export default ArtistDashboardPage;