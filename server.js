require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const chat = require('./sockets/chat');

chat(io);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => res.render('chat'));

http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});