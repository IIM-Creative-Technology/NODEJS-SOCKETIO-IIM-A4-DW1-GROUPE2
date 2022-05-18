import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { allUsersRoute, getUserRoute, host } from "../utils/APIRoutes";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    const data = await axios.get(
      getUserRoute,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      }
    )
    return setCurrentUser(data.data);
  }

  const fetchContacts = async () => {
    const token = localStorage.getItem('token')
    const data = await axios.get(`${allUsersRoute}`, {
      headers: {
        "Content-Type": "application/json",
        "auth-token": token
      }
    });

    return setContacts(data.data);
  }
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate("/login");
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchContacts()
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">
          {
            currentUser && <Contacts
              currentUserId={currentUser._id}
              contacts={contacts}
              changeChat={handleChatChange}
            />
          }


          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: flex;
    @media screen and (max-width: 720px) {
      flex-direction: column;
    }
  }
`;
