import Nav from './Nav.js';
import { useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

function LogIn(props) {
    const [userNameExisting, setUserNameExisting] = useState('');

    return (
        <Row>
            <Col sm='6'>
                <Input
                    type="text"
                    placeholder="existing username"
                    onChange={(e) => setUserNameExisting(e.target.value)} />
                <Link to={`/users/${userNameExisting}`}>
                    <Button
                        disabled={userNameExisting.length === 0}>
                        log in!
                    </Button>
                </Link>
            </Col>
        </Row>
    )
}

export default LogIn;