const db = require("../database/dbConfig");

module.exports = {
  find,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("comments").select();
}
