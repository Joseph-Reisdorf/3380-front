import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Account(){

    const navigate = useNavigate();
    const { loggedIn } = useAuth();

    // return information from the person's account
    return(
        <section>
            
            {!loggedIn && navigate("/not-logged-in")}
            <p>Hello Welcome to the Account page</p>
        </section>
    );
}

export default Account;