import { Avatar, Button, IconButton } from '@material-ui/core';
import { Chat as ChatIcon, MoreVert, SearchOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import EmailValidator from 'email-validator';
import { auth, db} from '../firebase'
import { doc, setDoc, addDoc } from "firebase/firestore"; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from "firebase/firestore";
import Chat from './Chat';

function Sidebar(props) {
    const [user] = useAuthState(auth);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const getChatSnapshot = async () => {
            const chatsRef = query(collection(db, "chats"), where("users", "array-contains", user.email));
            const chatSnapshot = await getDocs(chatsRef);

            setChats(chatSnapshot.docs)
        }
        getChatSnapshot();
    }, [])

    // const chatsRef = query(collection(db, "chats"), where("users", "array-contains", user.email));

    const onCreateChat = () => {
        const input = prompt('Please enter an email address of the user who you wish to chat with.');

        const addChat = async() => {
            await addDoc(collection(db, "chats"), {
                users: [user.email, input]
              });
        }

        if(!input) {
            return null;
        }

        if(EmailValidator.validate(input) && !chatAlreadyExist(input) && input !== user.email) {
            addChat();
        }

    }

    const chatAlreadyExist = (recipientEmail) => {
        return !!chats.find(
            (chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
        )
    }

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
                <IconContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </IconContainer>
            </Header>
            <Search>
                <SearchOutlined />
                <SeachInput placeholder='Seach in chats'/>
            </Search>

            <SidebarButton onClick={onCreateChat}>
                Start a new chat
            </SidebarButton>

            {
                chats.map((chat) => {
                    return <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                })
            }
        </Container>
    )
}

Sidebar.propTypes = {}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Header = styled.div`
    align-items: center;
    border-bottom: 1px solid whitesmoke;
    background-color: white;
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
    padding: 16px;
    height: 80px;
    z-index: 1;
`;

const UserAvatar = styled(Avatar)``;

const IconContainer = styled.div``;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SeachInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&& {
        border-bottom: 1px solid whitesmoke;
        border-top: 1px solid whitesmoke;
    }
`