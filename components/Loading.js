import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {Circle} from 'better-react-spinkit';
import styled from 'styled-components'

function Loading(props) {
  return (
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <div>
            <img 
                src="/png/whatsapp-logo-4456.png" 
                alt=""
                style={{ marginBottom: '10px' }}
                height="200px"
            />
            
            <Circle color="#3cbc28" size={60} />
        </div>
    </center>
  )
}

// const Container = styled.div`
//     display: grid;
//     place-items: center;
//     height: 100vh;
// `;

Loading.propTypes = {}

export default Loading
