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
  deleteOne,
};

function find() {
  return db("users")
    .select("users.*", "roles.role")
    .join("user_roles", "user_roles.user_id", "users.id")
    .join("roles", "roles.id", "user_roles.role_id");
}

function getUser(id) {
  return (
    db("users")
      // .select("id", "first_name", "last_name", "email")
      .select()
      .where({ id })
      .first()
  );
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
    .select("id", "username", "role_id", "first_name", "last_name")
    .where({
      id,
    })
    .first(); // return an object instead of an array
}

// filter-search function for login
function findBy(filter) {
  return db("users")
    .select("users.*", "roles.role")
    .join("user_roles", "user_roles.user_id", "users.id")
    .join("roles", "roles.id", "user_roles.role_id")
    .where(filter);
}

// Edit user info
function editById(id, update) {
  return db("users")
    .where({ id })
    .update(update, ["id", "username", "first_name"]);
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

// DELETE user
function deleteOne(id, update) {
  return db("users").where({ id }).del();
}
