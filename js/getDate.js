const date = () => {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}
  ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

module.exports = date;
