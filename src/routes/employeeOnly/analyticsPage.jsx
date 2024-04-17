import { React , useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import GenreReportPage from './genreReportPage';

import { useAuth } from '../../context/authContext';
//import ReportsPage from './reportsPage';

const AnalyticsPage = () => {



    const { loggedIn, userId, userRole, loading } = useAuth();

    const navigate = useNavigate();


    const [show, setShow] = useState(false);




    const handleShow = () => {
        setShow(true);

    };

    const handleClose = () => {
        setShow(false);
    };



    useEffect(() => {
        if (!loading && loggedIn) {
            const verifited = userRole === 'e' || userRole === 'a';
            if (!verifited) {
                navigate('/');
            }
        }
    }, [loggedIn, userRole, loading]);

    useEffect(() => {
        if (!loading && loggedIn) {

        }
    }, [loggedIn, loading]);

    return (
        <div>
            <h1>Employee Dashboard</h1>
            <button onClick={handleShow}>Genre Report</button>
            {show && <GenreReportPage close={handleClose} />}
        </div>
        

    );
};

export default AnalyticsPage;