"use client";

import { useState } from "react";
import { getPassInputs, getEmailInputs } from "./modules/zus";

export default function Home() {
  const [isLoading, setToLoading] = useState(false);

  const { inputPass, addPass } = getPassInputs();
  const { inputEmail, addEmail } = getEmailInputs();

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

    async function fetchCorrectUser() {
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

    fetchCorrectUser().then((data) => {
      setToLoading(false);
      console.log(data);
    });

    // fetch("http://localhost:8080/api/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify([{ email: inputEmail, password: inputPass }]),
    // })
    // .then((response) => {
    //   setToClicked(false)
    //   if(response.status === 204) {
    //     console.log(response.status)
    //   }

    //   return response.json()
    // })
    // .then((data) => {
    //   console.log(data)
    // })
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
    </>
  );
}
