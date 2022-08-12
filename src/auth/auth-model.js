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

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("users")
    .select("users.*", "roles.role", "user_roles.role_id")
    .join("user_roles", "user_roles.user_id", "users.id")
    .join("roles", "roles.id", "user_roles.role_id")
    .where("is_deleted", false);
}

function getUser(id) {
  return db("users")
    .select("users.*", "roles.role")
    .join("user_roles", "user_roles.user_id", "users.id")
    .join("roles", "roles.id", "user_roles.role_id")
    .where("users.id", id)
    .first();
}

function addUser(user) {
  return db
    .transaction(function (t) {
      console.log("whats user ", user);
      return db("users")
        .transacting(t)
        .select()
        .insert(
          {
            username: user.username,
            password: user.password,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          },
          "id"
        )
        .then((response) => {
          const [id] = response;
          console.log("whats response", id);
          return db("user_roles").transacting(t).select().insert(
            {
              role_id: user.role_id,
              user_id: id,
            },
            "user_roles.user_id"
          );
        })
        .then(t.commit)
        .catch(t.rollback);
    })
    .then((response) => {
      const [id] = response;
      console.log("transaction succeeded ", id, response);
      return findById(id);
    })
    .catch((err) => {
      console.log("transaction failed", err);
    });
}

// FIND user by id
function findById(id) {
  return db("users")
    .select("id", "username", "first_name", "last_name", "user_roles.role_id")
    .join("user_roles", "users.id", "user_roles.user_id")
    .where({
      id,
    })
    .first();
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
  return db
    .transaction(function (t) {
      return db("users")
        .transacting(t)
        .select()
        .where({ id })
        .update(
          {
            username: update.username,
            password: update.password,
            email: update.email,
            first_name: update.first_name,
            last_name: update.last_name,
            updated_at: timestamp,
          },
          ["id", "username", "first_name"]
        )
        .then(() => {
          return db("user_roles")
            .transacting(t)
            .select()
            .where("user_id", id)
            .update({
              role_id: update.role_id,
            });
        })
        .then(t.commit)
        .catch(t.rollback);
    })
    .then(() => {
      console.log("transaction succeeded ", id);
      return findById(id);
    })
    .catch((err) => {
      console.log("transaction failed", err);
    });
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
function deleteOne(id) {
  return db("users").where({ id }).update({ is_deleted: true });
}
