import React, { useEffect } from 'react';
import Header from '../components/Header.js';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Row, Col, Input, Button, Jumbotron, Card } from 'reactstrap';
import { useApp } from '../utilities/AppContext.js';
import { useAuth } from '../utilities/AuthContext.js';

function SignUp() {
  const app = useApp();
  const auth = useAuth();

  const [passwordConf, setPasswordConf] = useState('');

  let history = useHistory();

  async function signUp() {
    if (app.password === passwordConf) {
      await auth.signUp(app.name, app.email, app.password);
    } else {
      alert('Your passwords don\'t match! Please try again.');
    }
  }

  // this doesn't work properly when auth.token is listed as a dependency,
  // but react complains that it should be listed
  useEffect(() => {
    auth.token !== '' && history.push(`/users/${app.user.id}`);
  }, [app.user])

  return (
    <>
      <Header />
      <Jumbotron
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1545494097-1545e22ee878?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Z2xpdHRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=800&q=60)', backgroundSize: '100%', opacity: '0.8' }}>
        <Row>
          <Col sm='6' className='offset-sm-3'>
            <Card>
              {
                auth.token
                  ? (
                    <>
                      <h3>You're already logged in!</h3>
                      <Link to="/">
                        <Button
                          className="btn-success"
                          onClick={() => auth.signOut()}>
                          Log out
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <h3>Sign Up</h3>
                      <Input
                        type="text"
                        placeholder="name"
                        onChange={(e) => app.setName(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="email address"
                        onChange={(e) => app.setEmail(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="password"
                        onChange={(e) => app.setPassword(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="confirm password"
                        onChange={(e) => setPasswordConf(e.target.value)}
                      />
                      <Button
                        className='btn-success'
                        onClick={() => signUp()}
                        disabled={
                          app.name.length === 0
                          || app.email.length === 0
                          || app.password.length === 0
                          || app.password.length !== passwordConf.length}>
                        create account!
                    </Button>
                    </>
                  )
              }
            </Card>
          </Col>
        </Row>
      </Jumbotron>
    </>
  )
}

export default SignUp;