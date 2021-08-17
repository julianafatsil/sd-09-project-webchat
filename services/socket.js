const chatModel = require('../models/chatModel');

const addZero = (numero) => {
  if (numero <= 9) return `0${numero}`;
  return numero; 
};

const getTime = () => {
  const currentDate = new Date();
  const traco = '-';
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const espaco = ' ';
  const doisPontos = ':';
  const currentDateFormated = addZero(currentDate.getDate().toString())
  + traco + addZero(currentDate.getMonth() + 1).toString()
  + traco + currentDate.getFullYear() 
  + espaco + hour + doisPontos + addZero(minute.toString())
  + doisPontos + addZero(seconds.toString()); 
  return currentDateFormated;
};

const createMessage = (chatMessage, nickName) => {
  const date = getTime();
  return {
    message: `${date} ${nickName} ${chatMessage}`,
    timestamp: date,
};
};

const iD = () => `_${Math.random().toString(36).substr(2, 9)}`;

module.exports = {
  createMessage,
  iD,
};

const saveUserOnDb = async (nickName, socketId) => {
  console.log(`${nickName} conectado`);
  const id = await chatModel.createUsers(nickName, 'online', socketId);
  return id;
};

const handleWithNewConnection = async (io, socket) => {
  try {
    const nickName = `userId${iD()}`;
    const id = await saveUserOnDb(nickName, socket.id);
    const users = await chatModel.findUser();
    const messages = await chatModel.findMessages();
    console.log(users);
    socket.emit('userId', id, nickName, users);
    socket.broadcast.emit('refreshUsers', users);  
    io.emit('refreshMessages', messages);
  } catch (e) {
    console.log(e.message);
  }
};

const handleMessageEvent = async (io, chatMessage, nickname) => {
  const messageObj = createMessage(chatMessage, nickname);
  const { message, timestamp } = messageObj;
  const nickNameChat = nickname;
  await chatModel.createMessage(chatMessage, nickNameChat, timestamp);
  io.emit('message', message);
};

const handleChangeNickname = async (io, socket, userObj) => {
  const { userNickname, userId, newNickname } = userObj;
  await chatModel.updateUser(userId, newNickname);
  await chatModel.updateMessages(userNickname, newNickname);
  const users = await chatModel.findUser();
  const messages = await chatModel.findMessages();
  socket.emit('userId', userId, newNickname, users);
  socket.broadcast.emit('refreshUsers', users);
  io.emit('refreshMessages', messages);
};

const handleWithDisconnectEvent = async (socketId, io) => {
  await chatModel.deleteUser(socketId);
  const users = await chatModel.findUser();
  io.emit('refreshUsers', users);
};

module.exports = {
  handleWithNewConnection,
  handleChangeNickname,
  handleMessageEvent,
  handleWithDisconnectEvent,
};