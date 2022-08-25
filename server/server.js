
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const allowedMimes = ['image/bmp', 'image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];

const tgToken = process.env.TGTOKEN;
const chatId = process.env.chatId;

function getCaption(body) {
  let { name, email, style, description } = body;
  return `${name}
${email}
${style}
${description}`.slice(0,1024);
}

function sendBadRequest(res) {
  res.statusCode = 400;
  res.end('Bad request');
}

const bot = new TelegramBot(tgToken, {polling: true});
const app = express();
const port = 3001;

app.use(cors());
app.use(express.static('public'));

app.post('/order', upload.single('file'), async (req, res) => {
  const file = req.file;
  try{
    console.log(file);
    if(!file || !req.body || !req.body.email) {
      sendBadRequest(res);
      return;
    }
    console.log(allowedMimes.includes(file.mimetype));
    if(!allowedMimes.includes(file.mimetype)){
      sendBadRequest(res);
      return;
    }
    const caption = getCaption(req.body);
    const buffer = fs.readFileSync(file.path);
    await bot.sendPhoto(chatId, buffer, { caption });
    console.log('success');
  } catch(e) {
    console.log(e);
    sendBadRequest(res);
  } finally {
    if(file){
      fs.unlink(file.path, (e) => {
        console.log(`cant delete file ${file.path}`);
        console.log(e)
      })
    }
  }
  res.end('Ok');
})

app.listen(port, () => {
  console.log(`Server is listening on ${port}`)
})
