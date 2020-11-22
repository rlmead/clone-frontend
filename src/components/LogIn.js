import React, { useContext } from 'react';
import Header from '../components/Header.js';
import { useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../utilities/manageAuth.js';

function LogIn() {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const auth = useAuth();

    let history = useHistory();

    async function logIn() {
        await auth.signin(emailAddress, password);
        history.push(`/users/${auth.user}`);
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
                        onClick={() => logIn()}
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