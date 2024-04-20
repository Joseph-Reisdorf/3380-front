import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { Typography, Paper, Container, FormControl, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';

const AddDepartmentPage = ({ close }) => {

    const { loggedIn, userId, userRole, loading } = useAuth();

    const [adminList, setAdminList] = useState([]);


    const errRef = useRef();
    const [formData, setFormData] = useState({
        departmentName: '',
        departmentManagerId: '',
    });


    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.departmentName === '') {
            setErrMsg("Department Name is required.");
            return false;
        }
        if (!adminList.includes(formData.departmentManagerId)) {
            setErrMsg("Enter a valid Manager ID.");
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            try {
                const res = await axios.post(`${process.env.REACT_APP_BACK_URL}/departments/add_department`, formData);
                
                if (res.status === 200) {
                    setSuccess(true);
                    setErrMsg('Department added successfully.');
                }
            }
            catch (error) {
                console.error(error);
                setErrMsg("Failed to add department.");

            }
        }
        else {
            setErrMsg("Failed to add department.");
        }
    };

    useEffect(() => {
        if (!loading && loggedIn) {
            const fetchAdmins = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/employees/get_admins`);
                    setAdminList(res.data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchAdmins();
        }
    }, [loggedIn, loading, userId]);

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Add Department
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                {errMsg && <Typography color="error" gutterBottom ref={errRef}>{errMsg}</Typography>}
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Department Name"
                        type="text"
                        name="departmentName"
                        value={formData.departmentName}
                        onChange={handleChange}
                        required
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="manager-label">Manager</InputLabel>
                    <Select
                        labelId="manager-label"
                        id="manager-select"
                        name="departmentManagerId"
                        value={formData.departmentManagerId}
                        label="Manager"
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="">
                            <em>Select Manager</em>
                        </MenuItem>
                        {adminList.map((admin) => (
                            <MenuItem key={admin.employee_id} value={admin.employee_id}>
                                {admin.employee_id}: {admin.employee_firstname} {admin.employee_lastname}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" type="submit" sx={{ mt: 3, mb: 2 }}>
                    Add Department
                </Button>
            </form>
        </Paper>
    </Container>
);
};

export default AddDepartmentPage;
