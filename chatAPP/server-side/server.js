const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
require("dotenv").config();

const express = require("express");
const app = express();
const port = 8080;

const supabaseUrl = "https://apkuarlppngqawvovkqh.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// const { data, error } = await supabase
// .from('Users')
// .select()

app.use(bodyParser.json());

async function fetchUsers() {
  const { data, error } = await supabase.from("Users").select();

  return data;
}

async function fetchMsg() {
  const { data, error } = await supabase.from("Msg").select();

  return data;
}

const fetchedUsers = fetchUsers();
const fetchedMsg = fetchMsg();

app.get("/api/users", (req, res) => {
  fetchedUsers.then((x) => {
    const names = x.map((obj) => obj.name);

    res.json(names);
  });
});

app.post("/api/login", (req, res) => {
  //   data.then((data) => {
  //     if (data[0].email === req.body[0].email) {
  //         res.json([{id: data[0].id}])
  //     }
  //     else{
  //         res.json("Wrong Email")
  //     }
  //   });
});

app.get("/api/messages", (req, res) => {
  fetchedMsg.then((x) => {
    const Msg = x.map((obj) => obj);

    res.json(Msg);
  });
});

app.post("/api/mensage/add", (req, res) => {});

app.listen(port, () => console.log("Ouvindo na Porta: " + port));
