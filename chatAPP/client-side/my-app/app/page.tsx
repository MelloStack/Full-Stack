"use client";

import { useEffect, useState } from "react";
import { getPassInputs, getEmailInputs, getUsersFunc } from "./modules/zus";
import { io } from "socket.io-client";

export default function Home() {

  const [isLoading, setToLoading] = useState(false);
  const [CurrentUserId, setCurrentUserId] = useState(0);

  const { inputPass, addPass } = getPassInputs();
  const { inputEmail, addEmail } = getEmailInputs();
  const { Users, addUsers } = getUsersFunc();

  // const socket = io("http://localhost:8080")
  
  const getEmailInputValue = (e: any) => {
    addEmail(e.target.value);
  };

  const getPassInputValue = (e: any) => {
    addPass(e.target.value);
  };

  async function fetchAllUsers() {
    const response = await fetch("http://localhost:8080/api/Users");

    return response.json();
  }

  async function fecthMsg() {
    const response = await fetch("http://localhost:8080/api/messages");

    return response.json();
  }

  const tryLog = () => {
    setToLoading(true);
    if (
      !inputEmail ||
      !inputPass ||
      inputEmail.indexOf("@") === -1 ||
      inputEmail.indexOf("gmail") === -1 ||
      inputEmail.indexOf(".com") === -1
    ) {
      setToLoading(false);
      return;
    }

    async function fetchCurrentUser() {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ email: inputEmail, password: inputPass }]),
      });

      if (response.status === 204) {
        setToLoading(false);
        console.log(response.status);
        return;
      }

      return response.json();
    }

    fetchCurrentUser().then((dataCurrentUser) => {
      setToLoading(false);

      if (!dataCurrentUser) return;

      setCurrentUserId(dataCurrentUser[0].id);
      fetchAllUsers().then((dataUsers) => {
        const names = dataUsers[0].names;

        names.map((x: string[]) => {
          addUsers(x);
        });
      });
    });

    fecthMsg();
  };

  const getUserChat = (e: any) => {
    fetchAllUsers().then((dataUsers) => {
      const users = dataUsers[0].users;

      users.map((x: any) => {
        if (e.target.innerHTML === x[0].name) {
          const UserChatId = x[0].id;

          fecthMsg().then((data) => {
            data.map((msg: any) => {
              const ReceiveBy = msg.ReceiveBy;
              const SendBy = msg.SendBy;

              if (UserChatId === CurrentUserId) return;

              if (ReceiveBy != CurrentUserId) return;

              if (SendBy != UserChatId) return;

              console.log(msg);
            });
          });
        }
      });
    });
  };

  

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <input
          onChange={getEmailInputValue}
          type="text"
          id="name"
          placeholder="email"
        />
        <input
          onChange={getPassInputValue}
          type="text"
          id="password"
          name="password"
          placeholder="password"
        />
        {isLoading ? (
          <h3>Carregando....</h3>
        ) : (
          <input onClick={tryLog} type="submit" value="Login" />
        )}
        {Users.map((x) => (
          <h3 onClick={getUserChat}>{x}</h3>
        ))}
      </main>
    </>
  );
}
