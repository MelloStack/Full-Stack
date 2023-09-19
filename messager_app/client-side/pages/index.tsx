import { json } from "node:stream/consumers";
import { useEffect, useState } from "react"

const adress = 'http://localhost:8080/api/'
const users = ['']  

async function getUsers() {
  try{
    const response = await fetch(adress+"users", {
        method: 'GET',
        headers: {
          'Conten-type':'application/json'
        }       
    })

    const result = await response.json().then(data => data)
    users.push(result[0].Username)
  }
  
  catch (error){
    console.error(error)
  }
}

getUsers()

export default function Home() {
  const [getInputChange, setInputChange] = useState()
  let canInsertName = false

  for (let i in users){
    if(users[i] != getInputChange){
      canInsertName = true
    }

    else{
      canInsertName = false
    }

  }

  const getName = (e:any) => {
    setInputChange(e.target.value);

  }



  async function Send_New_User() {

    if(canInsertName){
      try{
        const response = await fetch(adress+"addUsers", {
            method: 'POST',
            headers: {
              'Conten-type':'application/json'
            },
            body: JSON.stringify({
              name: getInputChange
            })
        })
  
        const result = await response.json().then(data => data)
        console.log(result)
      }
  
      catch (error){
        console.error(error)
      }
    }

    else{
      return
    }

  }

  const enter = () => {
 

    if(!getInputChange){
      console.log("vazio")
    }

    else{
      console.log(getInputChange)

      Send_New_User()
    }

  }

  return (
    <>
      <input placeholder="Nome" onChange={getName}/>
      <button onClick={enter}>Entrar</button>
    </>
  )
}
