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
      expand="md"
      fixed
      light>
      <Link
        to="/"
        className="text-dark"
        style={{ textDecoration: "none" }}>
        <h1>Idea Network</h1>
      </Link>
      <NavbarToggler onClick={toggle}/>
      <Collapse
        isOpen={isOpen}
        navbar >
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
                      history.push("/public/logout")
                    }}
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
                  {/* <NavItem>
                    <Link to="users" className="nav-link">
                      Browse
                    </Link>
                  </NavItem> */}
                </>
              )
          }
          <NavItem>
            <Link to="/public/about" className="nav-link">
              About
            </Link>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default Header;