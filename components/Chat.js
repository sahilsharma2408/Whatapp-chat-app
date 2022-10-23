import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Avatar } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import {getRecipientEmails} from '../utils/getRecipientEmails';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore'

function Chat({id, users}) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  // const [recipient, setRecipient] = useState([]);
  const recipientEmail = getRecipientEmails(users, user)

  const recipientQuery = query(collection(db, "users"), where("email", "==", getRecipientEmails(users, user)));    

  const [recipientSnapShot] = useCollection(recipientQuery);

  const recipient = recipientSnapShot?.docs?.[0]?.data();

  // useEffect(() => {
  //   const getRecipientSnapshot = async () => {
  //       const recipientRef = query(collection(db, "users"), where("email", "==", getRecipientEmails(users, user)));    
  //       const recipientSnapshot = await getDocs(recipientRef);
  //       const recipient = recipientSnapshot?.docs?.[0]?.data();

  //       setRecipient(recipient)
  //   }
  //   getRecipientSnapshot();
  // }, [])

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }
  console.log('######recipient?.photoURL', recipient?.photoURL)
  return (
    <Container onClick={enterChat}>
        {
          recipient ? (
            <UserAvatar src={recipient?.photoURL}/>
          ) : (
            <UserAvatar>{recipientEmail[0]}</UserAvatar>
          )
        }
        <p>{recipientEmail}</p>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
      background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;

Chat.propTypes = {}

export default Chat
