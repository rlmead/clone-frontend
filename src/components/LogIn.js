import React, { useContext } from 'react';
import Header from '../components/Header.js';
import { useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import AppContext from '../utilities/AppContext.js';
import { axiosCall } from '../utilities/axiosCall.js';

function LogIn() {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const context = useContext(AppContext);

    let history = useHistory();

    function loadProfile(response) {
        context.setCurrentUser(response);
        history.push(`/users/${response}`);
    }

    async function logIn(authData) {
        console.log(authData);
        await axiosCall(
            'post',
            '/users/get_id',
            {
                'email': emailAddress
            },
            {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            loadProfile
        );
    }

    async function authenticateUser() {
        await axiosCall(
            'post',
            '/v1/oauth/token',
            {
                grant_type: "password",
                client_id: '2',
                client_secret: "iOgp23lMwnBdyHOmpglk56acuSMGIEAJAmNCPXGq",
                password: password,
                username: emailAddress,
                scope: ""
            },
            {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            logIn
        )
    }

    return (
        <>
            <Header />
            <Row>
                <Col sm='6'>
                    <Input
                        type="text"
                        placeholder="email address"
                        onChange={(e) => setEmailAddress(e.target.value)} />
                    <Input
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)} />
                    <Button
                        onClick={() => authenticateUser()}
                        disabled={emailAddress.length === 0 || password.length === 0}>
                        log in!
                </Button>
                </Col>
                <Col sm='6'>
                    <Row>
                        <Col>
                            <Link to="signup">
                                <Button>
                                    sign up
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Link to="users">
                                <Button>
                                    browse anonymously
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default LogIn;