import React from 'react';
import Header from '../components/Header.js';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Input, Button, Jumbotron, Card } from 'reactstrap';
import { useAuth } from '../utilities/AuthContext.js';

function SignUp() {
  const [name, setName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const auth = useAuth();

  let history = useHistory();

  async function signUp() {
    await auth.signUp(name, emailAddress, password);
    history.push(`/users/${auth.user}`);
  }

  return (
    <>
      <Header />
      <Jumbotron
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1545494097-1545e22ee878?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Z2xpdHRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=800&q=60)', backgroundSize: '100%', opacity: '0.8' }}>
        <Row>
          <Col sm='6' className='offset-sm-3'>
            <Card>
              <h3>sign up</h3>
              <Input
                type="text"
                placeholder="name"
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="email address"
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                className='btn-success'
                onClick={() => signUp()}
                disabled={emailAddress.length === 0 || password.length === 0}>
                create account!
              </Button>
            </Card>
          </Col>
        </Row>
      </Jumbotron>
    </>
  )
}

export default SignUp;