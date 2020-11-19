import { Navbar, Row, Col, Button } from 'reactstrap';

function Nav(props) {
    return (
        <Navbar
            fixed='true'>
            <Row>
                <Col xs='4'>
                    <Button>
                        my profile
                    </Button>
                </Col>
                <Col xs='4'>
                    <Button>
                        all heroes
                    </Button>
                </Col>
                <Col xs='4'>
                    <Button>
                        log out
                    </Button>
                </Col>
            </Row>
        </Navbar>
    )
}

export default Nav;
// <Link to="/profile">log in</Link>