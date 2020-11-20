import Header from './Header.js';
import { useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LogIn(props) {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setpassword] = useState('');

    function handleSubmit() {
        console.log(emailAddress, password);
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8"
        };
        axios({
            url: "http://127.0.0.1:8000/v1/oauth/token",
            method: "post",
            data: {
                grant_type: "password",
                client_id: '2',
                client_secret: "iOgp23lMwnBdyHOmpglk56acuSMGIEAJAmNCPXGq",
                password: password,
                username: emailAddress,
                scope: ""
            },
            headers
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => console.log(error))
    }

    async function getId(emailAddress) {
        let response = await props.getData('/users/get_id', { 'email': emailAddress });
        console.log(response);
        // props.setCurrentUser(response.data.id);
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
                        onChange={(e) => setpassword(e.target.value)} />
                    <Button
                        onClick={() => handleSubmit()}
                        disabled={emailAddress.length === 0 || password.length === 0}>
                        log in!
                </Button>
                </Col>
                <Col sm='6'>
                    <Row>
                        <Col>
                            <Button onClick={() => getId(emailAddress)}>
                                get user id
                            </Button>
                        </Col>
                    </Row>
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