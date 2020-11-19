import Nav from './Nav.js';
import { useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';

function LogIn(props) {
    const [userNameExisting, setUserNameExisting] = useState('');

    return (
        <>
            <Nav />
            <Row>
                <Col sm='6'>
                    <Input
                        type="text"
                        placeholder="existing username"
                        onChange={(e) => setUserNameExisting(e.target.value)} />
                    <Button
                        onClick={() => alert(userNameExisting)}
                        disabled={userNameExisting.length === 0}>
                        log in!
                </Button>
                </Col>
            </Row>
        </>
    )
}

export default LogIn;