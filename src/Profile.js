import Nav from './Nav.js';
import { useState, useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';

function Profile(props) {
    return (
        <>
            <Nav />
            <Row>
                <Col sm='3'>
                    <img
                        className='img-fluid'
                        src="https://images.unsplash.com/photo-1483879504681-c0196ecceda5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80"></img>
                    <Button className='mt-3'>change pic</Button>
                </Col>
                <Col sm='9'>
                    <h1>name</h1>
                    <h3>about</h3>
                    <p></p>
                    <h3>bio</h3>
                </Col>
            </Row>
        </>
    )
}

export default Profile;