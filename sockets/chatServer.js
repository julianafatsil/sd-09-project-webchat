const usersList = {};

const createDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = (date.getMonth() + 1);
  const yaer = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const fullDate = `${day}-${month}-${yaer} ${hour}:${minutes}:${seconds}`;
  return fullDate;
};

const sendInitialUsersList = (socket) => {
  socket.emit('onlineUser', usersList);
};

const sendUsersList = (socket, io) => {
  socket.on('newUser', (newUser) => {
    usersList[socket.id] = newUser;

    io.emit('updateUsers', usersList);
  });
};

const removeUser = (socket, io) => {
  socket.on('disconnect', () => {
    delete usersList[socket.id];
    io.emit('updateUsers', usersList);
  });
};

const sendNewMessage = (socket, io) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const message = `${createDate()} - ${nickname}: ${chatMessage}`;
    io.emit('message', (message));
  });
};

const setInitailNick = (socket, io) => {
  socket.on('randomNick', (nick) => {
    usersList[socket.id] = nick;

    io.emit('updateUsers', usersList);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  sendInitialUsersList(socket);
  sendUsersList(socket, io);
  removeUser(socket, io);
  sendNewMessage(socket, io);
  setInitailNick(socket, io);
});