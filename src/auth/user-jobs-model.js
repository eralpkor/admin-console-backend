const db = require("../database/dbConfig");

module.exports = {
  find,
};

function find(userId) {
  // console.log("user id ", userId);
  return db("job").select().where("userId", userId);
}
