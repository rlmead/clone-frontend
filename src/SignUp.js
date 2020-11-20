import Header from './Header.js';
import { useState } from 'react';
import { Row, Col, Input, Button } from 'reactstrap';

function SignUp(props) {
    return (
        <>
            <Header />
            <Row>
                <Col sm='6'>
                    <Input
                        type="text"
                        placeholder="email address" />
                    <Input
                        type="text"
                        placeholder="name" />
                    <Input
                        type="text"
                        placeholder="username" />
                    <Input
                        type="password"
                        placeholder="password" />

                    <Button>
                        create account!
                </Button>

                </Col>
            </Row>
        </>
    )
}

export default SignUp;