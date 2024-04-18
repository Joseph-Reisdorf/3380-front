// distinct from artistPage -> is artistsPage
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Box, Button, Card, CardActions, CardContent, Grid, TextField, Typography } from '@mui/material';
import '../styles/ArtistsPage.css';

const ArtistsPage = () => {
    const { userId, loading, loggedIn, userRole } = useAuth();
    const navigate = useNavigate();
    const [artists, setArtists] = useState([]);
    const [likedArtists, setLikedArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!loading) {
            if (!loggedIn) navigate('/login');
            else if (userRole !== 'a' && userRole !== 'l') navigate('/');
        }
    }, [loading, loggedIn, userRole, navigate]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/get_artists`);

                setArtists(res.data);
            } catch (error) {
                console.error('Error fetching artists:', error);
            }
        };
        if (userId) fetchArtists();
    }, [userId]);

    useEffect(() => {
        const fetchLikedArtists = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/get_liked_artists/${userId}`);
                setLikedArtists(res.data.map(artist => artist.artist_id));
            } catch (error) {
                console.error('Error fetching liked artists:', error);
            }
        };

        if (userId) fetchLikedArtists();
    }, [userId]);

    const handleLike = async (artistId) => {
        const isLiked = likedArtists.includes(artistId);
        const method = isLiked ? 'delete' : 'post';
        const url = `${process.env.REACT_APP_BACK_URL}/artists/${isLiked ? 'unlike' : 'like'}/${artistId}/${userId}`;
        try {
            await axios[method](url);
            setLikedArtists(isLiked ? likedArtists.filter(id => id !== artistId) : [...likedArtists, artistId]);
        } catch (error) {
            console.error(`Error ${isLiked ? 'unliking' : 'liking'} artist:`, artistId, error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/search?artist_display_name=${searchTerm}`);
            setArtists(res.data);
        } catch (error) {
            console.error('Error searching artists:', error);
        }
    };

    return (
        <div className='artists-page'>
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Typography variant="h4" gutterBottom>All Artists</Typography>
            <form onSubmit={handleSearch} style={{ marginBottom: 2 }}>
                <TextField
                    label="Search by Name"
                    variant="outlined"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    fullWidth
                    sx={{ mt: 2, mb: 2 }}  
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>Search</Button> 
            </form>
            <Grid container spacing={2}>
                {artists.map((artist) => (
                    <Grid item xs={12} sm={6} md={4} key={artist.artist_id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">{artist.artist_display_name}</Typography>
                                <Typography variant="body2">{artist.artist_biography}</Typography>
                                <Typography variant="body2">Followers: {artist.follower_count}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleLike(artist.artist_id)}>
                                    {likedArtists.includes(artist.artist_id) ? 'Unlike' : 'Like'}
                                </Button>
                                <Button size="small" color="primary" onClick={() => navigate(`/artist/${artist.artist_id}`)}>
                                    View
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    </div>

    );
};

export default ArtistsPage;

/*
Reference code

import React, { useEffect, UseState } from "react";
import axios from "axios";

import "../styles/DebugFetchPerson.css";

const DebugGetPeople = () => {

    const [person, setPerson] = React.useState([]);

    useEffect(() => {
        const fetchAllPerson = async () => {
            try {
                const res = await axios.get("http://localhost:8080/debug_person/get_people");
                setPerson(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllPerson();
    }, []);


    return (
        <div className='debug-fetch-person'>
            {person.map((p) => (
                <div className="person" key={p.person_id}>
                    <h3>Name: {p.person_first_name} {p.person_middle_initial} {p.person_last_name}</h3>
                    <p>Email: {p.person_email}</p>
                    <p>Birthdate: {p.person_birthdate}</p>
                    <p>Address: {p.person_address}</p>
                </div>
            
            ))}
        </div>
    );
}

export default DebugGetPeople;
*/