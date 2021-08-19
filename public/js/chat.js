const socket = window.io();

const inputNickname = document.querySelector('#input-nickname');
const inputMessage = document.querySelector('#input-message');
const btnSend = document.querySelector('#btn-send');

btnSend.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', {
    nickname: inputNickname.value,
    chatMessage: inputMessage.value,
  });
  inputNickname.value = '';
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const ulMessages = document.querySelector('#ulMessages');
  const li = document.createElement('li');
  li.dataset.testid = 'message';
  li.innerText = message;
  ulMessages.appendChild(li);
};

const insertNickName = (nickName) => {
  const ulUsers = document.querySelector('#ulUsers');
  const li = document.createElement('li');
  li.dataset.testid = 'online-user';
  li.innerText = nickName;
  ulUsers.appendChild(li);
};

socket.on('message', (message) => createMessage(message));

socket.on('welcome', ({ nickname, messages }) => {
  insertNickName(nickname);
  messages.forEach((message) =>
    createMessage(`${message.timestamp} - ${message.nickname}: ${message.message}`));
});
