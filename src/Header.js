import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import { Link } from 'react-router-dom';

function Header(props) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <Navbar color="dark" expand="md" fixed="true">
            <NavbarBrand href="/">Idea Network</NavbarBrand>
            {
                props.currentUser &&
                <>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <Link to="users/0">
                                    <NavLink>
                                        my profile
                                    </NavLink>
                                </Link>
                            </NavItem>
                            <NavItem>
                                <Link to="/">
                                    <NavLink>
                                        log out
                                    </NavLink>
                                </Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </>
            }
        </Navbar>
    )
}

export default Header;