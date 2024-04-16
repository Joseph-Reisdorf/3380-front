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

    const handleLike = async (artistId) => {
        try {
            // Send a request to like/unlike the artist
            await axios.post(`${process.env.REACT_APP_BACK_URL}/artist_like/toggle_like`, null, {
                params: { artistId: artistId }
            });
            // Update the artists list after liking/unliking
            const updatedArtists = artists.map(artist => {
                if (artist.artist_id === artistId) {
                    return {
                        ...artist,
                        isLiked: !artist.isLiked // Toggle the isLiked state for the specific artist
                    };
                }
                return artist;
            });
            setArtists(updatedArtists);
        } catch (error) {
            console.error(error);
        }
    };

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
                    {/* Like/unlike button */}
                    <button onClick={() => handleLike(artist.artist_id)}>
                        {artist.isLiked ? 'Unlike' : 'Like'}
                    </button>
                    {/* Green check mark if artist is liked */}
                    {artist.isLiked && <span style={{ color: 'green' }}>✔</span>}
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
