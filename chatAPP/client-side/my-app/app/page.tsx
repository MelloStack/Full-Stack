"use client";

//SHADCN/UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { getPassInputs, getEmailInputs, getUsersFunc } from "./modules/zus";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://apkuarlppngqawvovkqh.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  const [isLoading, setToLoading] = useState(false);
  const [isLogin, setToLogged] = useState(false);

  const [CurrentUserName, setCurrentUserName] = useState([]);

  const [newMessageToCreate, setNewMessageToCreate] = useState("");
  const [MsgObj, setMsgObj] = useState([{}]);
  const [CurrentUserId, setCurrentUserId] = useState(0);

  // const [ReceiveBy, setReceiveBy] = useState(0);
  const [SendBy, setSendBy] = useState(0);

  const { inputPass, addPass } = getPassInputs();
  const { inputEmail, addEmail } = getEmailInputs();

  async function fetchAllUsers() {
    const response = await fetch("http://localhost:8080/api/Users");

    return response.json();
  }

  async function createMSG(MessageBody: string) {
    const response = await fetch("http://localhost:8080/api/messages/newMSG", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          person_name: CurrentUserName,
          SendBy: CurrentUserId,
          MessageBody: MessageBody,
        },
      ]),
    });

    return response.json();
  }

  useEffect(() => {
    const InsertEventSupa = (payload: any) => {
      const msgObj = payload.new;

      setSendBy(payload.new.SendBy);

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

    setToLogged(true);

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
      console.log(dataCurrentUser);
      setCurrentUserId(dataCurrentUser[0].id);
      setCurrentUserName(dataCurrentUser[0].name);
    });
  };

  const newtextChange = (data: any) => {
    setNewMessageToCreate(data.target.value);
  };

  const createNewMsgFunc = () => {
    createMSG(newMessageToCreate).then((data) => {
      console.log(data);
    });
  };

  const MsgContainer = () => {
    return (
      <>
       <div className="msg_min_hei">
       {MsgObj.map((data: any, index) => (
          <div className={CurrentUserName ? 'LeftText' : 'RigthText'} key={index}>
            <h2>{data.person_name}</h2>
            <h3 key={data.id}>{data.MessageBody}</h3>
          </div>            
        ))}
       </div>
      </>
    );
  };

  return (
    <>
      <section className="sectionMain">
        {!isLogin ? (
          <Tabs defaultValue="Login" className="tabsFlex">
            <TabsList>
              <TabsTrigger value="Login">Login</TabsTrigger>
              <TabsTrigger value="Register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="Login">
              <Card>
                <CardContent className="card text-center">
                  <h2>Login in Account</h2>
                  <div className="space"></div>
                  <Input
                    onChange={getEmailInputValue}
                    id="name"
                    type="text"
                    placeholder="Email"
                  />
                  <div className="space"></div>
                  <Input
                    onChange={getPassInputValue}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                  <div className="space"></div>
                  {isLoading ? (
                    <h3>Carregando....</h3>
                  ) : (
                    <Button onClick={tryLog}>Login</Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Register">
              <Card>
                <CardContent className="card text-center">
                  <h2>Create Account</h2>
                  <div className="space"></div>
                  <Input id="name" type="text" placeholder="Email" />
                  <div className="space"></div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                  <div className="space"></div>
                  {isLoading ? (
                    <h3>Carregando....</h3>
                  ) : (
                    <Button onClick={tryLog}>Login</Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          ""
        )}
        {isLogin ? (
          <Card>
            <CardContent className="card text-center">
              <h1>Voce esta no chat com o nome de {CurrentUserName}</h1>
              <MsgContainer />
              <Input onChange={newtextChange} type="text" />
              <Button onClick={createNewMsgFunc}>Send</Button>
            </CardContent>
          </Card>
        ) : (
          ""
        )}
      </section>
    </>
  );
}
