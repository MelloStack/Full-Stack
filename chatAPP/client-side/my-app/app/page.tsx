"use client";

import { useState } from "react";
import { getPassInputs, getEmailInputs } from "./modules/zus";

export default function Home() {
  const [isLogged, setisLogged] = useState(false);

  const [isClicked, setToClicked] = useState(false);

  const { inputPass, addPass } = getPassInputs();
  const { inputEmail, addEmail } = getEmailInputs();

  const getEmailInputValue = (e: any) => {
    addEmail(e.target.value);
  };

  const getPassInputValue = (e: any) => {
    addPass(e.target.value);
  };

  const tryLog = () => {
    setToClicked(true)
    if (!inputEmail || !inputPass)
      return setToClicked(false);
    if (
      inputEmail.indexOf("@") === -1 ||
      inputEmail.indexOf("gmail") === -1 ||
      inputEmail.indexOf(".com") === -1
    )
      return  setToClicked(false);

    async function sendInputs() {
      const reponse = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ email: inputEmail, password: inputPass }]),
      });

      return reponse.json();
    }

    sendInputs().then((data) => {
      console.log(data)
      setToClicked(false)
    }).catch((err) => {
      console.log(err)
      setToClicked(false)
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
          type="password"
          id="password"
          name="password"
          placeholder="password"
        />
        {isClicked ? <h3>Carregando....</h3> : <input onClick={tryLog} type="submit" value="Login" />}
      </main>
    </>
  );
}
