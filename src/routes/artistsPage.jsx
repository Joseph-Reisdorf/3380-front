// distinct from artistPage -> is artistsPage

import React, { useEffect, UseState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ArtistPage from "./artistPage"; // to search by id

const ArtistsPage = () => {

    const [artists, setArtist] = React.useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchAllArtists = async () => {
            try {
                const res = await axios.get("http://localhost:8080/artists/get_artists");
                setArtist(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllArtists();
    }, []);

    const handleClick = (e) => {
        e.preventDefault();

        const search = e.target.form.elements.search.value;
        navigate(`/artist/${search}`);
    }

    return (
        <div>
            <h1>All Artists</h1>

            {artists.map((a) => (
                <div className="artist" key={a.artist_id}>
                    <h3>Name: {a.artist_display_name}</h3>
                    <p>Biography: {a.artist_biography}</p>
                </div>
            ))}

            <form action="/search">
                <label>Search by ID:</label>
                <input type="number" name="search"></input>
                <button type="submit" onClick={handleClick}>Search</button>
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