const crypto = require('crypto');

const users = [];
const interviews = [];

module.exports = {
  users,
  interviews,
  createId: () => crypto.randomUUID(),
};
