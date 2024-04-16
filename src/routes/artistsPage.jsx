// distinct from artistPage -> is artistsPage
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';

const ArtistsPage = () => {
    const [artists, setArtists] = useState([]);

    const [likedArtists, setLikedArtists] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const { loggedIn, userId, userRole, loading } = useAuth();
    
    const navigate = useNavigate();

    // Redirect if not artist or listener
    useEffect(() => {
        if (!loading) {
            if (!loggedIn) {
                navigate('/login');
            }
            else if (userRole !== 'a') {
                if (userRole !== 'l') {  
                    navigate('/');
                }
            }
        }

    }, [loggedIn, userRole, loading, navigate]); // Depend on isArtist to reactively navigate

    // get all artists
    useEffect(() => {
        const fetchAllArtists = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/get_artists`);
                setArtists(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllArtists();
    }, []);

    // get liked artists
    useEffect(() => {
        if (!loading && userId) {
            const fetchLikedArtists = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/get_liked_artists/${userId}`);
                    
                    setLikedArtists(res.data.map(artist => artist.artist_id)); 
                    
                } catch (error) {
                    console.error("Error fetching liked tracks:", error);
                }
            };
            fetchLikedArtists();
        }
    }, [userId, loading]); 

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/artists/search?artist_display_name=${searchTerm}`);
            setArtists(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const goToArtistPage = (artistId) => {
        navigate(`/artist/${artistId}`);
    }
    
    const handleLike = async (artistId) => {
        const isLiked = likedArtists.includes(artistId);
        if (isLiked) {
            // Process unlike
            try {
                await axios.delete(`${process.env.REACT_APP_BACK_URL}/artists/unlike/${artistId}/${userId}`);
                setLikedArtists(likedArtists.filter(id => id !== artistId)); 
            } catch (error) {
                console.error("Error unliking artist", artistId, error);
            }
        } else {
            // Process like
            try {
                await axios.post(`${process.env.REACT_APP_BACK_URL}/artists/like/${artistId}/${userId}`);
                setLikedArtists([...likedArtists, artistId]); 
            } catch (error) {
                console.error("Error liking artist", artistId, error);
            }
        }
    };


    return (
        <div>
            <h1>All Artists</h1>

            {artists.map((artist) => (
                <div className="artist" key={artist.artist_id}>
                    {/* Like/unlike button */}
                    <button
                        onClick={() => handleLike(artist.artist_id)}
                        style={{ marginRight: "10px" }}
                    >
                        {likedArtists.includes(artist.artist_id) ? 'Unlike' : 'Like'}
                    </button>

                            

                    {/* Green check mark if artist is liked */}
                    {artist.isLiked && <span style={{ color: 'green' }}>✔</span>}
                    <h3>
                        
                        <a href="#" onClick={() => goToArtistPage(artist.artist_id)}>{artist.artist_display_name}</a>
                    </h3>
                    <p>Biography: {artist.artist_biography}</p>
                    <p>Followers: {artist.follow_count}</p>
                </div>
            ))}

            <form onSubmit={handleClick}>
                <label>Search by Name:</label>
                <input type="text" value={searchTerm} onChange={handleInputChange}></input>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

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