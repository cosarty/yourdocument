const createShcema = require('./util/createShcema');
const { model } = require('mongoose');
const messageSchema = createShcema({});

module.exports = model('Message', messageSchema);
