import React, { useState } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";

function Header() {
  const app = useApp();
  const { token, logOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);


  return (
    <Navbar
      expand="md"
      fixed="true"
      light>
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
                    to={`/users/${app.user.id}`}
                    className="nav-link">
                    {`${app.user.name}'s profile`}
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
    </Navbar>
  )
}

export default Header;