import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';

const NotificationsPage = () => {
    const [person, setPerson] = useState({});
    const [notifications, setNotifications] = useState([]);


    const { loggedIn, userId, userRole, loading } = useAuth();
    
    const navigate = useNavigate(); 



    useEffect(() => {
        if (!loading && loggedIn) {
            axios.get(`${process.env.REACT_APP_BACK_URL}/debug_person/get_person_by_id/${userId}`)
                .then((response) => {
                    setPerson(response.data);
                    console.log(person);
                })
                .catch((error) => {
                    console.error('Error fetching notifications:', error);
                });
        }
    }, [loggedIn, loading, userId]);

    useEffect(() => {
        if (!loading && loggedIn) {
            axios.get(`${process.env.REACT_APP_BACK_URL}/notifications/get_new_notifications/${userId}`)
                .then((response) => {
                    setNotifications(response.data);
                    console.log(notifications);
                })
                .catch((error) => {
                    console.error('Error fetching notifications:', error);
                });
        }
    }, [loggedIn, loading, userId, person]);

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


    return (
        <div>
            <h2>Notifications for {person.person_first_name}</h2>
            <ul>
                {notifications.length > 0 ? (notifications.map((notification) => (
                    <li key={notification.notification_id}>
                        
                        {notification.message}
                    </li>
                ))) : (<li>No new notifications</li>)}
            </ul>
        </div>
    )

};

export default NotificationsPage;
