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

  let navItems = token
    ? [
      { to: "/browse", text: "Browse ideas" },
      { to: "/ideas/new", text: "Add idea" },
      { to: `/users/${user.username}`, text: `${user.name}'s profile` },
      { to: "/public/logout", text: "Log out", onClick: () => logOut() }
    ]
    : [
      { to: "/browse", text: "Browse ideas" },
      { to: "/public/signup", text: "Sign up" },
      { to: "/public/login", text: "Log in" }
    ]

  return (
    <Navbar
      expand="md"
      light
      className="navbar-default navbar-dark sticky-top bg-dark">
        <Link
          to="/"
          className="text-white"
          style={{ textDecoration: "none" }}>
          <h1>Idea Network</h1>
        </Link>
        <NavbarToggler onClick={toggle} className="white" />
        <Collapse
          isOpen={isOpen}
          navbar >
          <Nav className="mr-auto" navbar>
            {
              navItems.map((item, index) => {
                return(
                  <NavItem>
                    <Link
                      key={`nav-item-${index}`}
                      className="nav-link text-white"
                      to={item.to}
                      onClick={item.onClick || ""}>
                      {item.text}
                    </Link>
                  </NavItem>
                )
              })
            }
          </Nav>
        </Collapse>
    </Navbar>
  )
}

export default Header;