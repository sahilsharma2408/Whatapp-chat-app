import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import ChatScreen from '../../components/ChatScreen'
import Sidebar from '../../components/Sidebar'
import { collection, query, doc, getDoc, getDocs, orderBy, where } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { getRecipientEmails } from '../../utils/getRecipientEmails'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Chat({chat, messages}) {
    const [user] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmails(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen 
                    chat={chat}
                    messages={messages}
                />
            </ChatContainer>
        </Container>
    )
}

export async function getServerSideProps(context) {
    const chatsRef = doc(db, "chats", context.query.id);

    const messagesRef = query(collection(db, "chats", context.query.id, "messages"), orderBy("timestamp", "asc"));

    const messagesRes = await getDocs(messagesRef);

    const messages = messagesRes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })).map((messages) => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));

    const chatRes =  await getDoc(chatsRef);

    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    
    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;