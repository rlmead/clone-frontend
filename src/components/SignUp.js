import React from 'react';
import Header from '../components/Header.js';
import { useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import axios from 'axios';

function SignUp(props) {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');

    function handleSubmit() {
        console.log(emailAddress, password);
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8"
        };
        axios({
            url: "http://127.0.0.1:8000/register",
            method: "post",
            data: {
                name,
                "username": userName,
                "email": emailAddress,
                password
            },
            headers
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => console.log(error))
    }

    return (
        <>
            <Header
                currentUser={props.currentUser}
                setCurrentUser={props.setCurrentUser} />
            <Row>
                <Col sm='6'>
                    <Input
                        type="text"
                        placeholder="email address" 
                        onChange={(e) => setEmailAddress(e.target.value)}
                        />
                    <Input
                        type="text"
                        placeholder="name" 
                        onChange={(e) => setName(e.target.value)}
                        />
                    <Input
                        type="text"
                        placeholder="username" 
                        onChange={(e) => setUserName(e.target.value)}
                        />
                    <Input
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)} 
                        />

                    <Button
                        onClick={() => handleSubmit()}
                        disabled={emailAddress.length === 0 || password.length === 0}>
                        create account!
                </Button>

                </Col>
            </Row>
        </>
    )
}

export default SignUp;