import React, { useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useIsArtist } from '../../context/authInfo';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import AddAlbumPage from './addAlbumPage';

const ArtistDashboardPage = () => {

    const { loggedIn, userId, userRole, loading } = useAuth();
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
  
    
    // get album list by primary_artist_id
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/albums/find_albums_by_artist/${userId}`);
                setAlbums(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAlbums();
    }, []);
    console.log("Albums: ", albums);
    /*
    // get artist by artist_id
    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/find_artist_by_id/${userId}`);
                setArtist(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchArtist();
    }, []);
    console.log("Artist: ", artist);
*/
    return (
        <div>
                <div>
                    <h1>Artist Dashboard</h1>
                </div>

                { /* Display albums if there are any */ }
                <div>
                    <h2>Albums</h2>
                
                    <ul>
                        {albums.map((album) => (
                            <li key={album.album_id}>
                                <h3>{album.album_title}</h3>
                                <p>{album.album_description}</p>
                                <p>{album.album_release_date.slice(0, 10)}</p> { /* slice to just date */}
                            </li>
                        ))}
                    </ul>
                </div>

                <Link className="link" to="add_album">Add Album</Link>
                <Routes>
                    <Route path="add_album" element={<AddAlbumPage />} />
                </Routes>
        </div>

    );
}

export default ArtistDashboardPage;