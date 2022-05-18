import axios from 'axios';
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import { getUserRoute } from "../utils/APIRoutes";
export default function Welcome() {
  const [userName, setUserName] = useState("");

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
    return setUserName(data.data.username);
  }

  useEffect(async () => {
    fetchUser()
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
