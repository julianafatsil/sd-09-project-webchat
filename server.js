const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

const { PORT } = process.env;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const chatController = require('./controller/chat');

const currentTime = () => {
  const data = new Date();
  const d = String(data.getDate()).padStart(2, '0');
  const m = String(data.getMonth()).padStart(2, '0');
  const a = String(data.getFullYear());
  const h = String(data.getHours());
  const mi = String(data.getMinutes()).padStart(2, '0');
  const s = String(data.getSeconds()).padStart(2, '0');

  return `${d}-${m}-${a} ${h}:${mi}:${s}`;
};

const guests = [];
let indexGest = 0;          

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

io.on('connection', (socket) => {
  indexGest += 1;
  console.log(`Guest${indexGest} conectado`);
  console.log(guests);
  guests.push(`Guest${indexGest}`);
  socket.emit('user', `Guest${indexGest}`);
  socket.broadcast.emit('newUser', `Guest${indexGest}`);

  socket.on('message', (message) => {
    const { nickname, chatMessage } = message;
    const completeMessage = `${currentTime()} - ${nickname}: ${chatMessage}`;
    io.emit('message', completeMessage);
  });
});

app.get('/', chatController.chat);

http.listen(PORT, () => [
  console.log(`Servidor online na porta ${PORT}`),
]);
