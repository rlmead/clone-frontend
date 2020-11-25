import React, { useState } from 'react';
import Header from '../components/Header.js';
import { Row, Col, Button, Nav, NavItem, NavLink } from 'reactstrap';
import { useApp } from '../utilities/AppContext.js';
import { useAuth } from '../utilities/AuthContext.js';

function Profile() {
  const [view, setView] = useState('about');
  const views = ['about', 'ideas', 'collabs', 'people'];

  const app = useApp();
  const auth = useAuth();

  const switchView = (view) => {
    switch (view) {
      default:
        return (
          <p>under construction</p>
        )
    }
  };

  return (
    <>
      <Header />
      <Row>
        <Col sm='3'>
          <h3>{'user #' + app.user.id}</h3>
          <img
            className='img-fluid'
            src="https://images.unsplash.com/photo-1490059830487-2f86fddb2b4b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"></img>
          <Button className='mt-3 btn-success'>change pic</Button>
        </Col>
        <Col sm='9'>
          <Nav
            justified
            tabs
            className='bg-light'>
            {
              views.map((item, index) => {
                return (
                  <NavItem
                    key={'button-' + index}>
                    <NavLink
                      className={(view === item) ? 'active' : ''}
                      id={item}
                      onClick={() => setView(item)}>
                      <h5>{item}</h5>
                    </NavLink>
                  </NavItem>
                )
              })
            }
          </Nav>
          {/* choose and render the body component based on the current view */}
          {switchView(view)}
          {/* <h1>{userId}</h1>
                    <h3>about</h3>
                    <p></p>
                    <h3>bio</h3> */}
        </Col>
      </Row>
    </>
  )
}

export default Profile;