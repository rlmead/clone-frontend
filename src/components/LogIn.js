import React, { useContext } from 'react';
import Header from '../components/Header.js';
import { useState } from 'react';
import { Row, Col, Input, Button, Jumbotron, Card } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../utilities/manageAuth.js';

function LogIn() {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const auth = useAuth();

  let history = useHistory();

  async function logIn() {
    await auth.signin(emailAddress, password);
    history.push(`/users/${auth.user}`);
  }

  return (
    <>
      <Header />
      <Jumbotron
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1545494097-1545e22ee878?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Z2xpdHRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=800&q=60)', backgroundSize: '100%', opacity: '0.8' }}>
        <Row>
          <Col sm='6'>
            <Card>
              <h3>log in</h3>
              <Input
                type="text"
                placeholder="email address"
                onChange={(e) => setEmailAddress(e.target.value)} />
              <Input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)} />
              <Button
                className='btn-success'
                onClick={() => logIn()}
                disabled={emailAddress.length === 0 || password.length === 0}>
                log in!
                        </Button>
            </Card>
          </Col>
          <Col sm='6'>
            <Card>
              <h3>not a member?</h3>
              <Row>
                <Col>
                  <Link to="signup">
                    <Button
                      className='btn-success'>
                      sign up
                                </Button>
                  </Link>
                </Col>
              </Row>
              <h3>or</h3>
              <Row>
                <Col>
                  <Link to="users">
                    <Button
                      className='btn-success'>
                      browse anonymously
                                </Button>
                  </Link>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Jumbotron>
    </>
  )
}

export default LogIn;