import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
export default function Logout({socket, userId}) {
  const navigate = useNavigate();
  const handleClick = async () => {
    socket.current.emit('disconnect-user', userId);
    localStorage.clear();
    navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      LOGOUT
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  color: white;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
