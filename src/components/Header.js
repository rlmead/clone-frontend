import React, { useState, useContext } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../utilities/AuthContext";
import appContext from "../utilities/AppContext";

function Header() {
  const context = useContext(appContext);

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
        className="text-dark"
        style={{ textDecoration: "none" }}>
        <h1>Idea Network</h1>
      </Link>
      {
        auth.token &&
        <>
          <NavbarToggler onClick={toggle} className="text-dark" />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <Link to={`users/${context.currentUser}`} className="nav-link">
                  {/* <NavLink> */}
                    my profile
                  {/* </NavLink> */}
                </Link>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => {
                    auth.logOut();
                    history.push("/")
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