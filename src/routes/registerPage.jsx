import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';



import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime"; // weird packages? 
import { Fragment as _Fragment } from "react/jsx-dev-runtime";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|cougarnet\.uh\.edu|uh\.edu)$/;



const CreateAccount = () => {
    
    const userRef = useRef();
    const errRef = useRef();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [email, setEmail] = useState('');

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [birthdate, setBirthdate] = useState('');
    const [validBirthdate, setValidBirthdate] = useState(false);
    const [birthdateFocus, setBirthdateFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setValidBirthdate(birthdate !== '');
    }, [birthdate]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd, birthdate, email])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate middle initial to be a single letter
        const middleInitialRegex = /^([A-Z]|)$/;
        if (!middleInitialRegex.test(middleInitial)) {
            setErrMsg("Middle initial must be a single letter of the alphabet.");
            return;
        }
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        
        try {
            const response = await axios.post("http://localhost:8080/register", {
                first_name: firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
                middle_initial: middleInitial.toUpperCase(),
                last_name: lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
                birthdate: birthdate,
                email: email.toLowerCase(),
                password: pwd,
                username: user
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: false
            });
            
            
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setFirstName('');
            setLastName('');
            setMiddleInitial('');
            setUser('');
            setPwd('');
            setMatchPwd('');
            setEmail('');
            setBirthdate('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="create-account-container">
            <button onClick={() => console.log({ validName, validPwd, validMatch, validBirthdate })
}>debug</button>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <Link to="/login">Login</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            required
                        />
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            required
                        />
                        <label htmlFor="middleInitial">Middle Initial:</label>
                        <input
                            type="text"
                            id="middleInitial"
                            maxLength="1"
                            onChange={(e) => setMiddleInitial(e.target.value)}
                            value={middleInitial}
                        />
                        <label htmlFor="username">
                            Username:
                            
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>


                        <label htmlFor="password">
                            Password:
                       
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                           
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                        
                         
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            
                            Must match the first password input field.
                        </p>

                        <label htmlFor="email">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-describedby="emailnote"
                        />
                        <p id="emailnote" className={!EMAIL_REGEX.test(email) ? "instructions" : "offscreen"}>
                            Email format must be valid and end with @gmail.com, @uh.edu, or @cougarnet.uh.edu
                        </p>
                        
                        <label htmlFor="birthdate">Birthdate:</label>
                        <input
                            type="date"
                            id="birthdate"
                            onChange={(e) => setBirthdate(e.target.value)}
                            value={birthdate}
                            required
                            aria-invalid={validBirthdate ? "false" : "true"}
                            aria-describedby="birthdatenote"
                            onFocus={() => setBirthdateFocus(true)}
                            onBlur={() => setBirthdateFocus(false)}
                        />


                        <button disabled={!validName || !validPwd || !validMatch || !validBirthdate ? true : false}>Sign Up</button>
                    </form>
                    
                </section>
            )}
        </div>
    );
}

export default CreateAccount;