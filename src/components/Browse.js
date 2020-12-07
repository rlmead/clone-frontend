import React, { useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import List from "./List";

function Browse() {
  const [view, setView] = useState("All Ideas");
  const views = ["All Ideas", "All Locations"];

  function switchView() {
    switch (view) {
      case "All Ideas":
        return (
          <List type="ideas" route="/ideas" />
        )
      case "All Locations":
        return (
          <List type="locations" route="/locations" />
        )
    }
  }

  return (
    <>
      <Nav
        justified
        tabs
        className="bg-light">
        {
          views.map((item, index) => {
            return (
              <NavItem
                key={"button-" + index}>
                <NavLink
                  className={(view === item) ? "active" : ""}
                  id={item}
                  onClick={() => setView(item)}>
                  <h5>{item}</h5>
                </NavLink>
              </NavItem>
            )
          })
        }
      </Nav>
      {switchView()}
    </>
  )
}

export default Browse;