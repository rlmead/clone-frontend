import React, { useState } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";
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
      { to: "/browse", text: "Browse" },
      { to: "/ideas/new", text: "Add idea" },
      { to: `/users/${user.username}`, text: `${user.name}'s profile` },
      { to: "/logout", text: "Log out", onClick: () => logOut() }
    ]
    : [
      { to: "/browse", text: "Browse" },
      { to: "/signup", text: "Sign up" },
      { to: "/login", text: "Log in" }
    ]

  return (
    <Navbar
      expand="md"
      light
      className="navbar-default navbar-light sticky-top text-primary bg-white">
        <Link
          to="/"
          className="text-primary"
          style={{ textDecoration: "none" }}>
          <h1>Idea Network</h1>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse
          isOpen={isOpen}
          navbar >
          <Nav style={{ display: "flex", flexFlow: "row nowrap" }} navbar>
            {
              navItems.map((item, index) => {
                return(
                  <NavItem className="mx-auto">
                    <Link
                      key={`nav-item-${index}`}
                      className="nav-link text-primary"
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