import React, { useState, useContext } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";
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
      <NavbarToggler onClick={toggle} className="text-dark" />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          {
            auth.token ? (
              <>
                <NavItem>
                  <Link to={`users/${context.currentUser}`} className="nav-link">
                    My profile
                  </Link>
                </NavItem>
                <NavItem>
                  <Link
                    onClick={() => {
                      auth.logOut();
                      history.push("/logout")
                    }}
                    className="nav-link">
                    Log out
                </Link>
                </NavItem>
              </>
            ) : (
                <>
                  <NavItem>
                    <Link to="/" className="nav-link">
                      Log in
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link to="signup" className="nav-link">
                      Sign up
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link to="users" className="nav-link">
                      Browse
                    </Link>
                  </NavItem>
                </>
              )
          }
          <NavItem>
            <Link to="about" className="nav-link">
              About
            </Link>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default Header;