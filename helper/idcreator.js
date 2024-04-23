// Creating a unique ID to mark the task as unique
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
