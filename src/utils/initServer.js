const db = require('../models/index');
const associations = require('../models/associations');

const initServer = () => {
  return new Promise((resolve, reject) => {
    db.sync()
      .then(() => {
        console.log('Database Connected Successfully');
        resolve(); // Resolve the promise if synchronization is successful
      })
      .catch((err) => {
        console.error('Error Connecting to DB:', err);
        reject(err); // Reject the promise if an error occurs
      });
  });
};

module.exports = initServer;
