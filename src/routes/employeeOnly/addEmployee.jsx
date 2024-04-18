import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@company\.com|central\.company\.com$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const AddEmployeePage = ( { close }) => {
    const errRef = useRef();
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
        <div className="create-account-container">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p><Link to="/login">Sign in</Link></p>
                </section>
            ) : (
                <section>
                    <form id="registerEmployeeForm" onSubmit={handleSubmit}>
                        <h1>Register Employee</h1>
                        {/* List of input fields using the same handleChange for all */}
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />

                        <label htmlFor="middleInitial">Middle Initial:</label>
                        <input type="text" id="middleInitial" name="middleInitial" value={formData.middleInitial} maxLength="1" onChange={handleChange} />

                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />

                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="pwd" value={formData.pwd} onChange={handleChange} required />

                        <label htmlFor="confirmPwd">Confirm Password:</label>
                        <input type="password" id="confirmPwd" name="confirmPwd" value={formData.confirmPwd} onChange={handleChange} required />

                        <label htmlFor="birthdate">Birthdate:</label>
                        <input type="date" id="birthdate" name="birthdate" value={formData.birthdate} onChange={handleChange} required />

                        <label htmlFor="department">Department ID:</label>
                        <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} required />

                        <label htmlFor="role">Role:</label>
                        <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} required />

                        <label htmlFor="salary">Salary:</label>
                        <input type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange} required />

                        <label htmlFor="hireDate">Hire Date:</label>
                        <input type="date" id="hireDate" name="hireDate" value={formData.hireDate} onChange={handleChange} required />

                        <label htmlFor="managerId">Manager ID:</label>
                        <input type="text" id="managerId" name="managerId" value={formData.managerId} onChange={handleChange} />

                        <label htmlFor="isAdmin">Admin Account:</label>
                        <input type="checkbox" id="isAdmin" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
                        <button type="submit">Register</button>
                    </form>
                </section>
            )}

        </div>
    );
};

export default AddEmployeePage;