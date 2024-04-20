import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';



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
        const middleInitialRegex = /^([A-Z]|[a-z]|)$/;
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
            const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/register`, {
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
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {success ? (
                    <>
                    <Typography variant="h5">Success!</Typography>
                    <Typography variant="subtitle1">
                        <Link to="/login">Click here to login</Link>
                    </Typography>
                    </>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {errMsg && <Alert severity="error" ref={errRef}>{errMsg}</Alert>}
                        <Typography component="h1" variant="h5">Register</Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="firstName"
                            autoFocus
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            id="middleInitial"
                            label="Middle Initial"
                            name="middleInitial"
                            inputProps={{ maxLength: 1 }}
                            value={middleInitial}
                            onChange={(e) => setMiddleInitial(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            inputRef={userRef}
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            error={!validName}
                            helperText={userFocus && user && !validName ? "4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed." : " "}
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            error={!validPwd}
                            helperText={pwdFocus && !validPwd ? "8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character." : " "}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="confirm_pwd"
                            label="Confirm Password"
                            type="password"
                            name="confirm_pwd"
                            autoComplete="new-password"
                            value={matchPwd}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            error={!validMatch}
                            helperText={matchFocus && !validMatch ? "Must match the first password input field." : " "}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!EMAIL_REGEX.test(email)}
                            helperText={!EMAIL_REGEX.test(email) ? "Email format must be valid and end with @gmail.com, @uh.edu, or @cougarnet.uh.edu" : " "}
                        />
                        
                        <TextField
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            required
                            fullWidth
                            id="birthdate"
                            label="Birthdate"
                            type="date"
                            name="birthdate"
                            autoComplete="bday"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            error={!validBirthdate}
                            onFocus={() => setBirthdateFocus(true)}
                            onBlur={() => setBirthdateFocus(false)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!validName || !validPwd || !validMatch || !validBirthdate}
                        >
                            Sign Up
                        </Button>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button variant="text">Already have an account? Sign in</Button>
                        </Link>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default CreateAccount;