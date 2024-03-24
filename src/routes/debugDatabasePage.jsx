import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import DebugAddPerson from './debugAddPersonPage';
import DebugGetPeople from './debugGetPeoplePage';

import '../styles/DebugDatabase.css';

const DebugDatabase = () => {
    return (
        <div className='debug-database'>
            <h1>Debug Database</h1>

            <Link className="link" to="get_people">Get people</Link>
            <Link className="link" to="add_person">Add person</Link>
            <Routes>
                <Route path="add_person" element={<DebugAddPerson />} />
                <Route path="get_people" element={<DebugGetPeople />} />
            </Routes>
        </div>
        
        
    );   
}

export default DebugDatabase;