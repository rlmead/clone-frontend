import Nav from './Nav.js';
import { useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LogIn(props) {
    const [emailAddress, setEmailAddress] = useState('');
    const [passWord, setPassWord] = useState('');

    function handleSubmit() {
        console.log(emailAddress, passWord);
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
                password: passWord,
                username: emailAddress,
                scope: ""
            },
            headers
        })
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }

    return (
        <Row>
            <Col sm='6'>
                <Input
                    type="text"
                    placeholder="email address"
                    onChange={(e) => setEmailAddress(e.target.value)} />
                <Input
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassWord(e.target.value)} />
                <Button
                    onClick={() => handleSubmit()}
                    disabled={emailAddress.length === 0 || passWord.length === 0}>
                    log in!
                </Button>
            </Col>
        </Row>
    )
}

export default LogIn;