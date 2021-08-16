const socket = window.io();

const sendButton = document.querySelector('#send-button');
const nicknameButton = document.querySelector('#nickname-button');
const inputMessage = document.querySelector('#messageInput');
const inputNickname = document.querySelector('#nickname-box');
const usersUl = document.querySelector('.users');
// const nickname = document.querySelector('.users');
sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: inputMessage.value, 
    nickname: usersUl.firstChild.innerText });
  inputMessage.value = '';
  return false;
});

nicknameButton.addEventListener('click', (e) => {
  e.preventDefault();
  // socket.emit('newNickname', { newNickname: inputNickname.value, 
  //   oldNickname: usersUl.firstChild.innerText });
  usersUl.firstChild.innerText = inputNickname.value;
  inputNickname.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message'); 
  messagesUl.appendChild(li);
};
const createUser = (id) => {
  const li = document.createElement('li');
  li.innerText = id;
  li.setAttribute('data-testid', 'online-user'); 
  usersUl.prepend(li);
};
// const populateUsers = (array) => {
//   usersUl.innerHTML = null;
//   console.log('passou ṔASSOU');
//   array.forEach((id) => {
//     const li = document.createElement('li');
//     li.innerText = id;
//     li.setAttribute('data-testid', 'online-user');
//     usersUl.prepend(li);
//   });
// };

socket.on('message', (message) => createMessage(message));
// socket.on('newUser', ({ connectedUsers }) => populateUsers(connectedUsers));
socket.on('newUser', ({ id }) => createUser(id));