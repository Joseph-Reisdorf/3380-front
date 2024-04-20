import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';
import { Typography, List, ListItem, Container, CircularProgress } from '@mui/material';


const NotificationsPage = () => {
    const [person, setPerson] = useState({});
    const [notifications, setNotifications] = useState([]);


    const { loggedIn, userId, userRole, loading } = useAuth();
    
    const navigate = useNavigate(); 



    useEffect(() => {
        if (!loading && loggedIn) {
            axios.get(`${process.env.REACT_APP_BACK_URL}/debug_person/get_person_name_by_id/${userId}`)
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
    <Container sx={{ mt: 4, mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
            Notifications for {person.person_first_name || "User"}
        </Typography>
        <List sx={{ bgcolor: 'background.paper' }}>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <ListItem key={notification.notification_id} sx={{ my: 0.5, py: 1, px: 2, bgcolor: 'grey.100', borderRadius: '4px' }}>
                        {notification.message}
                    </ListItem>
                ))
            ) : (
                <ListItem sx={{ my: 0.5, py: 1, px: 2, bgcolor: 'grey.200', borderRadius: '4px' }}>
                    No new notifications
                </ListItem>
            )}
        </List>
    </Container>

    );
};

export default NotificationsPage;