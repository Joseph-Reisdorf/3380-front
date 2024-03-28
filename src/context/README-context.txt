

Defines 4 functions/variables that can be used to interact with the login status

To access these use this code sturucture:


import React, { useState } from 'react';

import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Page = () => {
    const { loggedIn } = useAuth(); 
    // this gives the boolean status of loggedIn
    

For more user authorization, I am looking into JWT decode, as much of our user 
data is stored in local storage in the browser. By decoding these web tokens,
we can view the user role, and decide their access to the page.

Check for JWT decode in the package.json in the future. 

  
