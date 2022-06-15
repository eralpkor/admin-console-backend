const db = require("../database/dbConfig");

module.exports = {
  addUser,
  findById,
  findBy,
  editById,
  findByName,
  findByEmail,
  find,
  getUser,
};

function find() {
  return db("users");
}

function getUser(id) {
  return db("users")
    .select("id", "first_name", "last_name", "email")
    .where({ id })
    .first();
}

function addUser(user) {
  return db("users")
    .insert(user, "id")
    .then((ids) => {
      const [id] = ids;
      return findById(id);
    });
}

function findById(id) {
  return db("users")
    .select("id", "username")
    .where({
      id,
    })
    .first(); // return an object instead of an array
}

// filter-search function
function findBy(filter) {
  return db("users")
    .select("id", "first_name", "last_name", "username", "email")
    .where(filter)
    .first();
}

// Edit user info
function editById(id, update) {
  return db("users").where({ id }).update(update, "*");
}

// for validation
function findByName(username) {
  return db("users")
    .select("username")
    .where({
      username,
    })
    .first();
}

// for validation
function findByEmail(email) {
  return db("users")
    .select("email")
    .where({
      email,
    })
    .first();
}
