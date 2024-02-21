"use client";

import { useEffect, useState } from "react";
import { getPassInputs, getEmailInputs, getUsersFunc } from "./modules/zus";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://apkuarlppngqawvovkqh.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  const [isLoading, setToLoading] = useState(false);
  const [CurrentUserName, setCurrentUserName] = useState([])

  const [newMessageToCreate, setNewMessageToCreate] = useState('')
  const [MsgObj, setMsgObj] = useState([{}]);
  const [CurrentUserId, setCurrentUserId] = useState(0);


  // const [ReceiveBy, setReceiveBy] = useState(0);
  // const [SendBy, setSendBy] = useState(0);


  const { inputPass, addPass } = getPassInputs();
  const { inputEmail, addEmail } = getEmailInputs();

  async function fetchAllUsers() {
    const response = await fetch("http://localhost:8080/api/Users");

    return response.json();
  }

  async function createMSG(MessageBody:string) {
    const response = await fetch("http://localhost:8080/api/messages/newMSG", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{person_name: CurrentUserName, SendBy: CurrentUserId, MessageBody: MessageBody }]),
    });

    return response.json()
  }

  useEffect(() => {
    const InsertEventSupa = (payload: any) => {
      const msgObj = payload.new;

      // setSendBy(payload.new.SendBy);

      setMsgObj((prevState) => [...prevState, msgObj]);
      console.log("Created, New Array: " + JSON.stringify(MsgObj));
      

    };

    const DeleteEventSupa = (payload: any) => {
      if (!MsgObj) return;
      setMsgObj(MsgObj.filter((item) => item.id === payload.new.id));
      console.log("Deleted, New Array: " + JSON.stringify(MsgObj));
    };

    const channel = supabase
      .channel("Msg")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Msg" },
        (payload) => {
          if (payload.eventType == "INSERT") {
            InsertEventSupa(payload);
          }

          if (payload.eventType == "DELETE") {
            DeleteEventSupa(payload);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const getEmailInputValue = (e: any) => {
    addEmail(e.target.value);
  };

  const getPassInputValue = (e: any) => {
    addPass(e.target.value);
  };


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
      console.log(dataCurrentUser)
      setCurrentUserId(dataCurrentUser[0].id);
      setCurrentUserName(dataCurrentUser[0].name)
    });
    
  };

  const newtextChange = (data:any) => {
    setNewMessageToCreate(data.target.value)
  }

  const createNewMsgFunc = () => {
    createMSG(newMessageToCreate).then((data) => {
        console.log(data)
    })
  }

  const Chat = () => {

    return (
      <>
        {MsgObj.map((data: any) => (
          <>
          <h2>{data.person_name}</h2>
          <h3 key={data.id}>{data.MessageBody}</h3>
          </>
        ))}
      </>
    );
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
      </main>
      <main className="chatContainer">
        <div className="chat">
          <h1>Voce esta no chat com o nome de {CurrentUserName}</h1>
          <Chat />
          <input onChange={newtextChange} type="text"></input>
          <input onClick={createNewMsgFunc} style={{width: "100px"}} type="submit" value="Send"/>
        </div>
      </main>
    </>
  );
}
