import React from 'react'
import styled from 'styled-components'
import Head from 'next/head';
import WhatsappImg from '../public/png/whatsapp-logo-4456.png'
import { Button } from '@material-ui/core';
import { signInWithGoogle } from '../firebase';

function Login(props) {

  const onSignUp = () => {
    // auth
    signInWithGoogle()
  }

  return (
    <Container>
        <Head>
            <title>Login</title>
        </Head>

        <LoginContainer>
            <Logo src="/png/whatsapp-logo-4456.png" />
            <Button onClick={onSignUp} variant="outlined">Sign in with Google</Button>
        </LoginContainer>
    </Container>
  )
}

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
`;

const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;

Login.propTypes = {}

export default Login
