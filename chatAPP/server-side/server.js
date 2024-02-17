require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const http = require('http');
const server = http.createServer(app);


const port = 8080;


const supabaseUrl = "https://apkuarlppngqawvovkqh.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, PATCH, OPTIONS"
  );
  next();
});

const emails = [];
const passwords = [];
const names = [];
const IDs = [];

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
    // const ids = x.map((obj) => obj.id);
    let users = []

    x.map((obj) => {
      users.push([{name:obj.name, id:obj.id}])
    })

    res.json([{
      names: names,
      users: users,
    }]);
    
  });
});

app.post("/api/login", function (req, res) {
  fetchUsers().then((data) => {
    data.map((x) => {
      const email = x.email;
      const name = x.name;
      const password = x.password;
      const ID = x.id;

      if (email === req.body[0].email && password === req.body[0].password) {
        emails.push(email);
        passwords.push(password);
        names.push(name);
        IDs.push(ID);
      }
    });
  });

  if (
    emails.includes(req.body[0].email) &&
    passwords.includes(req.body[0].password)
    
  ) {
    res.json([{ id: IDs.pop(), name: names.pop()}]);
  }

  res.status(204).send();
});

app.get("/api/messages", (req, res) => {
  fetchedMsg.then((x) => {
    const Msg = x.map((obj) => obj);

    res.json(Msg);
  });
});

app.post("/api/messages/newMSG", (req, res) => {});

server.listen(port, () => console.log("Ouvindo na Porta: " + port));
