const { PrismaClient } = require('./prisma/client')

const prisma = new PrismaClient()

const express = require('express');
const app = express();
const bodyparse = require('body-parser');
const jsonParse = bodyparse.json();



const cors = require('cors');

app.use(cors());


const port = 8080;

app.listen(port, () => console.log("Listen on: "+port));

app.get('/api/users', (req, res) => {
    async function main(){
      const users = await prisma.user.findMany()
      res.json(users)
    }

    main().then(async () => {
      await prisma.$disconnect
    }).catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })

});

app.post('/api/addUsers', jsonParse, (req, res) => {
    console.log(req.body)
    res.json({isaa: true})
});

app.get('/api/messages', (req, res) => {

    async function main(){
      const getMessages = await prisma.messages.findMany()
      console.log(getMessages)
    }

    main().then(async () => {
      await prisma.$disconnect
    }).catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
});
