import Nav from './Nav.js';
import { useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';

function SignUp(props) {
    return (
        <>
            <Nav />
            <Row>
                <Col sm='6'>
                    <Input
                        type="text"
                        placeholder="new username" />
                    <Input
                        type="text"
                        placeholder="about you" />
                    <Input
                        type="text"
                        placeholder="biography" />

                    <Button>
                        create account!
                </Button>

                </Col>
            </Row>
        </>
    )
}

export default SignUp;