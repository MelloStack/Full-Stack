require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const cors = require("cors");
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
app.use(
  cors({
    origin: "*",
  })
);

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

app.post("/api/login", cors(), async function (req, res){
  fetchUsers().then((data) => {
    data.map((x) => {
      const email = x.email;
      const password = x.password;
      const ID = x.id;

      // async function dadad() {
      //   if (email === req.body[0].email && password === req.body[0].password) {
      //     res.json([{ id: ID }]);
      //   }
      // }
      
      // dadad().catch((x) => {
      //   res.send("Erro")
      // })

    });
  });
});

app.get("/api/messages", (req, res) => {
  fetchedMsg.then((x) => {
    const Msg = x.map((obj) => obj);

    res.json(Msg);
  });
});

app.post("/api/messages/newMSG", (req, res) => {});

app.listen(port, () => console.log("Ouvindo na Porta: " + port));
