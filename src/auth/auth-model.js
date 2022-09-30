const db = require("../database/dbConfig");

module.exports = {
  addUser,
  findUnique,
  findBy,
  update,
  findByName,
  findByEmail,
  find,
  getUser,
  deleteOne,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("user").select("user.*").where("isDeleted", false);
}

function getUser(id) {
  return db("user").select().where({ id }).first();
}

function addUser(data) {
  console.log("whats new user ", data);
  return db("user")
    .insert(
      {
        username: data.username,
        password: data.password,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        updatedAt: timestamp,
      },
      "id"
    )
    .then((ids) => {
      const [{ id }] = ids;
      return findUnique(id);
    });
}

// FIND user by id
function findUnique(id) {
  return db("user").select().where({ id }).first();
}

// filter-search function for login
function findBy(filter) {
  return db("user").select("user.*").where(filter);
}

function update(id, data) {
  return db("user")
    .where({ id })
    .update(
      {
        username: data.username,
        password: data.password,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        updatedAt: timestamp,
      },
      "id"
    )
    .then((ids) => {
      const [{ id }] = ids;

      return findUnique(id);
    });
}

// for validation
function findByName(username) {
  return db("user")
    .select("username")
    .where({
      username,
    })
    .first();
}

// for validation
function findByEmail(email) {
  return db("user")
    .select("email")
    .where({
      email,
    })
    .first();
}

// DELETE user
function deleteOne(id) {
  return db("user").where({ id }).update({ is_deleted: true });
}
