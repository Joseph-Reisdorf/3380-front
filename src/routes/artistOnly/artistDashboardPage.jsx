import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsArtist } from '../../context/authInfo';
import { useAuth } from '../../context/authContext';
import {Link} from 'react-router-dom';

const ArtistDashboardPage = () => {

    /*
    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/artist/get_artist`);
                setArtist(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchArtist();
    }
    , []);*/

    const isArtist = useIsArtist();
    const { loggedIn } = useAuth();
    const navigate = useNavigate();
  
    // // If not an artist, redirect to login page
    // useEffect(() => {
    //   if (!loggedIn) {
    //     navigate('/login');
    //   }
    //   else if (!isArtist) {
    //     navigate('/');
    //   }
    // }, [isArtist, navigate]); // Depend on isArtist to reactively navigate
  
    return (
        // if not logged in, redirect to login page
        <div>
                <div>
                    <h1>Artist Dashboard</h1>
                    <Link to="artist_reportspage">
                <button>View Reports</button>
            </Link>
                </div>

        </div>

    );
}

export default ArtistDashboardPage;