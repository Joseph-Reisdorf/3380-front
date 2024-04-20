import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Container, TextField, Button, Paper, Typography, Checkbox, FormControlLabel, Alert } from '@mui/material';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@company\.com|central\.company\.com$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const AddEmployeePage = ( { close }) => {
    const errRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleInitial: '',
        email: '',
        pwd: '',
        confirmPwd: '',
        birthdate: '',
        department: '',
        role: '',
        salary: '',
        hireDate: '',
        managerId: '',
        isAdmin: false
    });
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value  // Toggle between true and false correctly for checkboxes
        }));
        console.log(formData);
    };

    const validateForm = () => {
        if (formData.pwd !== formData.confirmPwd) {
            setErrMsg("Passwords do not match.");
            return false;
        }
        if (!PWD_REGEX.test(formData.pwd)) {
            setErrMsg("Password must be 8-24 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.");
            return false;
        }
        if (!EMAIL_REGEX.test(formData.email)) {
            setErrMsg("Invalid email format.");
            return false;
        }
        if (formData.managerId === '' && formData.isAdmin == false) {
            setErrMsg("Manager ID is required.");

            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            
            const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/register/employee`, formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response.data);
            setSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                middleInitial: '',
                email: '',
                pwd: '',
                confirmPwd: '',
                birthdate: '',
                department: '',
                role: '',
                salary: '',
                hireDate: '',
                managerId: '',
                isAdmin: false
            });
            close();

        } catch (err) {
            setErrMsg('Failed to register. Please try again.');
            errRef.current.focus();
        }
    };
    return (
        <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Register Employee</Typography>
            {success ? (
                <Alert severity="success">
                    <Typography>Success!</Typography>
                    <Link to="/login">Sign in</Link>
                </Alert>
            ) : (
                <form onSubmit={handleSubmit}>
                    {errMsg && <Alert severity="error" ref={errRef}>{errMsg}</Alert>}
                    <TextField fullWidth margin="normal" label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Middle Initial" name="middleInitial" value={formData.middleInitial} inputProps={{ maxLength: 1 }} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Password" type="password" name="pwd" value={formData.pwd} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Confirm Password" type="password" name="confirmPwd" value={formData.confirmPwd} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Birthdate" type="date" name="birthdate" value={formData.birthdate} InputLabelProps={{ shrink: true }} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Department ID" name="department" value={formData.department} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Role" name="role" value={formData.role} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Salary" type="number" name="salary" value={formData.salary} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Hire Date" type="date" name="hireDate" value={formData.hireDate} InputLabelProps={{ shrink: true }} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Manager ID" name="managerId" value={formData.managerId} onChange={handleChange} />
                    <FormControlLabel control={<Checkbox checked={formData.isAdmin} onChange={handleChange} name="isAdmin" />} label="Admin Account" />
                    <Button type="submit" variant="contained" color="primary">Register</Button>

                </form>
            )}
        </Paper>
        </Container>
    );
};

export default AddEmployeePage;