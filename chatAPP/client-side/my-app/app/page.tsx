"use client";

import { useEffect, useState } from "react";
import { getPassInputs, getEmailInputs, getUsersFunc } from "./modules/zus";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://apkuarlppngqawvovkqh.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  const [isLoading, setToLoading] = useState(false);
  const [CurrentUserId, setCurrentUserId] = useState(0);

  const [isMsgProcessed, setMsgProcessed] = useState(false)

  const [ProcessedMsg, setProcessedMsg] = useState([{}]);

  const [MsgObj, setMsgObj] = useState([{}]);

  const { inputPass, addPass } = getPassInputs();
  const { inputEmail, addEmail } = getEmailInputs();
  const { Users, addUsers } = getUsersFunc();

  useEffect(() => {
    const InsertEventSupa = (payload: any) => {

      const msgObj = payload.new;
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

  async function fetchAllUsers() {
    const response = await fetch("http://localhost:8080/api/Users");

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
  };

  const getUserChat = (e: any) => {
    fetchAllUsers().then((dataUsers) => {
      const users = dataUsers[0].users;

      users.map((x: any) => {
        if (e.target.innerHTML === x[0].name) {
          const UserChatId = x[0].id;
          const stringifyMsg = JSON.parse(JSON.stringify(MsgObj))

          stringifyMsg.map((data:any) => {


            setProcessedMsg(prevState => [...prevState, data.MessageBody, data.id])
            setMsgProcessed(true)
          })
          // const stringifyMsgReceiveBy = stringifyMsg[0].msgObj.ReceiveBy 
          // const stringifyMsgSendBy = stringifyMsg[0].msgObj.SendBy 
          // const stringifyMsgId = stringifyMsg[0].msgObj.id 
          // const stringifyMsgBody = stringifyMsg[0].msgObj.MessageBody 

          // if(stringifyMsgSendBy != UserChatId) return

          // if(stringifyMsgReceiveBy != CurrentUserId) return

          // setProcessedMsg(prevState => [{...prevState, stringifyMsgBody, stringifyMsgId}])

          // console.log(ProcessedMsg)

        }
      });
    });
  };

  const Chat = () => {
    return (<>
      {/* {ProcessedMsg.map((data:any) => <h3>{data.MessageBody}</h3>)} */}
    </>)
  }

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
      <main className="chatContainer">
        <div className="chat">
          <Chat />
          {isMsgProcessed ? <Chat /> : "Carregando Mensagens....."}
        </div>
      </main>
    </>
  );
}
