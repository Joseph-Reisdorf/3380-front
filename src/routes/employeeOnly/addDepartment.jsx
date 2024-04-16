import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';


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
        console.log(formData);
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
        <div className="create-account-container">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                    <form id="Add department" onSubmit={handleSubmit}>
                        <h1>Add Department</h1>
                        {/* List of input fields using the same handleChange for all */}
                        <label >Department Name:</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        <label >Manager</label>
                        <select
                            name="playlist_id"
                            value={formData.departmentManagerId || ''}
                            onChange={e => setFormData(currentFormData => ({ ...currentFormData, departmentManagerId: e.target.value }))}
                        >
                            <option value="" disabled>Select Manager</option>
                            {adminList.map((a) => (
                                <option key={a.employee_id} value={a.employee_id}>{a.employee_id}: {a.employee_firstname} {a.employee_lastname}</option>
                            ))}
                        </select>
                        <button onClick={close} type="submit">Add</button>
                    </form>

        </div>
    );
};

export default AddDepartmentPage;