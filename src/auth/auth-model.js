const db = require("../database/dbConfig");

module.exports = {
  addUser,
  findById,
  findBy,
  editById,
  findByName,
  findByEmail,
};

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
    .first();
}

function findBy(filter) {
  return db("users").where(filter);
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
