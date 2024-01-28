"use client";

// import { useCartStore } from "./modules/zus";
import { Button } from "@/components/ui/button";
import Login from "./modules/login";
import { useState } from "react";

export default function Home() {
  const [isLogged, setisLogged] = useState(false);
  
  // const {currentId, addCurrentId: changeID} = useCartStore()

  // const test = () => {
  //     changeID(5)
  // }

  return (
    <>
      {!isLogged ? <Login /> : "Chat"}
    </>
  );
}
