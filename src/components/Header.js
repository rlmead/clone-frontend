import React, { useState } from "react";
import { Container, Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";

function Header() {
  const { user } = useApp();
  const { token, logOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);


  return (
    <Navbar
      expand="md"
      light
      className="navbar-default navbar-fixed-top">
      <Container>
        <Link
          to="/"
          className="text-dark"
          style={{ textDecoration: "none" }}>
          <h1>Idea Network</h1>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse
          isOpen={isOpen}
          navbar >
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link to="/public/about" className="nav-link">
                About
            </Link>
            </NavItem>

            {
              token ? (
                <>
                  <NavItem>
                    <Link
                      to="/ideas"
                      className="nav-link">
                      Browse ideas
                  </Link>
                  </NavItem>
                  <NavItem>
                    <Link
                      to={`/users/${user.id}`}
                      className="nav-link">
                      {`${user.name}'s profile`}
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link
                      to="/public/logout"
                      onClick={() => logOut()}
                      className="nav-link">
                      Log out
                </Link>
                  </NavItem>
                </>
              ) : (
                  <>
                    <NavItem>
                      <Link to="/public/login" className="nav-link">
                        Log in
                    </Link>
                    </NavItem>
                    <NavItem>
                      <Link to="/public/signup" className="nav-link">
                        Sign up
                    </Link>
                    </NavItem>
                  </>
                )
            }
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  )
}

export default Header;