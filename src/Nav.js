import { Navbar, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <Navbar
            fixed='true'>
            <Row>
                <Col xs='6'>
                    <Link to="users/0">
                        <Button>
                            my profile
                        </Button>
                    </Link>
                </Col>
                <Col xs='6'>
                    <Link to="/">
                        <Button>
                            log out
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Navbar>
    )
}

export default Nav;
// <Link to="/profile">log in</Link>