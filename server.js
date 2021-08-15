const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const onlineUsers = [];

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const db = require('./models/webchat');

const utils = require('./utils');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', async (_request, res) => {
  const chatData = await db.getHistory();
  res.render('index', { chatData });
});

io.on('connection', (socket) => {
  socket.on('message', async (data) => {
   const { nickname, chatMessage } = data;
   const timestamp = utils.formatDate();
   await db.saveMessages({ message: chatMessage, nickname, timestamps: timestamp });

  io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });

  socket.on('save', (d) => {
    onlineUsers.push(d);
    io.emit('onlineUsers', onlineUsers);
  });
});

server.listen(3000, () => console.log('Socket running on port', 3000));
