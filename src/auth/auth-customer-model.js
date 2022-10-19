const db = require("../database/dbConfig");
module.exports = {
  find,
  findById,
  updateCustomer,
  create,
  findByEmail,
};
var timestamp = new Date().toLocaleDateString();

// SELECT *, firstName || " " || lastName AS FullName FROM customer
// var colums = knex.raw(
//   'SELECT *, firstName || " " || lastName AS FullName FROM customer'
// );
// .columns(db.raw("firstName || ' ' || lastName AS fullName"));

function find() {
  return db("customer").select().where("isDeleted", false);
}

function findById(id) {
  return db("customer").where({ id }).first();
}

function updateCustomer(id, changes) {
  return db("customer")
    .where({ id })
    .update(
      {
        firstName: changes.firstName,
        lastName: changes.lastName,
        email: changes.email,
        phone: changes.phone,
        company: changes.company,
        comment: changes.comment,
        updatedAt: timestamp,
      },
      ["id", "firstName", "lastName"]
    )
    .then((ids) => {
      const [{ id }] = ids;
      return findById(id);
    });
}

function create(changes) {
  return db("customer")
    .insert(
      {
        firstName: changes.firstName,
        lastName: changes.lastName,
        email: changes.email,
        phone: changes.phone,
        company: changes.company,
        comment: changes.comment,
        updatedAt: timestamp,
      },
      "id"
    )
    .then((ids) => {
      const [{ id }] = ids;
      return findById(id);
    });
}

// for validation
function findByEmail(email) {
  return db("customer")
    .select("email")
    .where({
      email,
    })
    .first();
}
