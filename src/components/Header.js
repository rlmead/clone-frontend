import React, { useState, useContext } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../utilities/manageAuth.js';
import AppContext from '../utilities/AppContext.js';

function Header() {
  const context = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const auth = useAuth();

  let history = useHistory();

  return (
    <Navbar
      color="light"
      expand="md"
      fixed="true">
      <Link
        to="/"
        className='text-dark'
        style={{ textDecoration: 'none' }}>
        <h1>Ideary</h1>
      </Link>
      {
        auth.user &&
        <>
          <NavbarToggler onClick={toggle} className='text-dark' />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <Link to={`users/${context.currentUser}`}>
                  <NavLink>
                    my profile
                  </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => {
                    context.setCurrentUser(null);
                    history.push('/')
                  }}>
                  log out
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </>
      }
    </Navbar>
  )
}

export default Header;