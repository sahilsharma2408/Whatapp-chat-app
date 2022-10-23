import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, Mic, MoreVert } from '@material-ui/icons';
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db, auth } from '../firebase';
import { useRouter } from 'next/router';
import Message from './Message';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, addDoc, serverTimestamp, collection, query, orderBy, where } from "firebase/firestore";
import { getRecipientEmails } from '../utils/getRecipientEmails';
import TimeAgo from 'timeago-react';

function ChatScreen({chat, messages}) {
    const router = useRouter();

    const [user] = useAuthState(auth);

    const [input, setInput] = useState('')

    const messagesQuery = query(collection(db, "chats", router.query.id, "messages"), orderBy("timestamp", "asc"));

    const [messageSnapShot] = useCollection(messagesQuery);

    const recipientQuery = query(collection(db, "users"), where("email", "==", getRecipientEmails(chat.users, user)));    

    const [recipientSnapShot] = useCollection(recipientQuery);

    const recipient = recipientSnapShot?.docs?.[0]?.data();

    const endOfMessageRef = useRef(null);

    const showMessages = () => {
        if(messageSnapShot) {
            return messageSnapShot.docs.map(message => {
                return (
                    <Message
                        key={message.id} 
                        user={message.data().user}
                        message={{
                            ...message.data(),
                            timestamp: message.data().timestamp?.toDate().getTime()
                        }} 
                    />
                )
            })
        } else {
            return JSON.parse(messages).map((message) => {
                return (
                    <Message
                        key={message.id} 
                        user={message.user}
                        message={message} 
                    />
                )
            })
        }
    }

    const scrollToBottom = () => {
        if(endOfMessageRef.current) {
            endOfMessageRef.current.scrollIntoView({behavior:'smooth', block: 'start'})
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault();

        const userRef = doc(db, 'users', user.uid);

        setDoc(userRef,
            {
            lastSeen: serverTimestamp(),
            }, 
            { merge: true }
        );

        await addDoc(collection(db, "chats", router.query.id, "messages"), {
            timestamp: serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput('')
        scrollToBottom()
    }

    const recipientEmail = getRecipientEmails(chat.users, user)

    return (
        <Container>
        <Header>
                {
                    recipient ? (
                        <Avatar src={recipient?.photoURL}/>
                    ) : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }
                <HeaderInformation>
                        <h3>{recipientEmail}</h3>
                        {/* <p>Last Seen ...</p> */}
                        {
                            recipientSnapShot ? (
                                <p>
                                    Last active {" "}
                                    {
                                        recipient?.lastSeen?.toDate() ? (
                                            <TimeAgo datetime={recipient.lastSeen?.toDate()}/>
                                        ) : ( "Unavailable")
                                    }
                                </p>
                            ) : (
                                <p>Loading Last active... </p>
                            )
                        }
                </HeaderInformation>
                <HeaderIcons>
                        <IconButton>
                            <AttachFile />
                        </IconButton>
                        <IconButton>
                            <MoreVert />
                        </IconButton>
                </HeaderIcons>
        </Header>

        <MessageContainer>
            {/* Show Messages */}
            {showMessages()}
            <EndOfMessage ref={endOfMessageRef}/>
        </MessageContainer>

        <InputContainer>
            <InsertEmoticon />
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
            <button hidden disabled={!input} type="submit" onClick={sendMessage}/>
            <Mic />
        </InputContainer>
        </Container>
    )
}

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;

const Container = styled.div``;
const Header = styled.div`
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
    padding: 11px;
    height: 80px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;
const HeaderIcons = styled.div``;
const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: grey;
    }
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

export default ChatScreen;
