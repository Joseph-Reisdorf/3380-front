import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

import "../styles/DebugAddPerson.css";

const DebugAddPerson = () => {
    const [person, setPerson] = useState({
        first_name: "",
        middle_initial: "",
        last_name: "",
        email: "",
        birthdate: "",
        password: ""
    });

    const handleChange = (e) => {
        setPerson({
            ...person,
            [e.target.name]: e.target.value
        });
    };

    const handleClick = async e => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/debug_person/add_person", person);

        } catch (err) {
            console.log(err);
        };
    };
    return (
        <div className='debug-add-person'>
            <h2>Debug Add New Person</h2>
            <form>
                <input type="text" placeholder="First Name" onChange={handleChange} name="first_name" />
                <input type="text" placeholder="M.I." onChange={handleChange} name="middle_initial" />
                <input type="text" placeholder="Last Name" onChange={handleChange} name="last_name" />
                <input type="text" placeholder="Email" onChange={handleChange} name="email" />
                <input type="date" onChange={handleChange} name="birthdate" />
                <input type="text" placeholder="Password" onChange={handleChange} name="password" />
                <button type="submit" onClick={handleClick}>Add Person</button>
            </form>
        </div>
        
    );
};

export default DebugAddPerson; 