const connection = require('./connection');

const createMessage = async (message, nickname) => {
await connection()
  .then((db) => db.collection('messages')
  .insertOne({ message, nickname, timestamp: new Date().toLocaleString('es-CL') })); // o formatdo de data do chile bate com o pedido
};

const historyRead = async () => {
  const list = await connection()
    .then((db) => db.collection('messages').find().project({_id: 0}).toArray());
  
  // console.log('no model', list)
  return list;
};

module.exports = {
  createMessage,
  historyRead,
};
