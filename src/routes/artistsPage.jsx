// distinct from artistPage -> is artistsPage
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArtistsPage = () => {
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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

    return (
        <div>
            <h1>All Artists</h1>

            {artists.map((artist) => (
                <div className="artist" key={artist.artist_id}>
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