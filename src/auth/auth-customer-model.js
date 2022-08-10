const db = require("../database/dbConfig");

module.exports = {
  find,
  findBy,
  findById,
  updateCustomer,
  addCustomer,
  findByEmail,
};
var timestamp = new Date().toLocaleDateString();

// SELECT *, first_name || " " || last_name AS FullName FROM customers
// var colums = knex.raw(
//   'SELECT *, first_name || " " || last_name AS FullName FROM customers'
// );
function find() {
  return db("customers")
    .select("customers.*")
    .columns(db.raw("first_name || ' ' || last_name AS full_name"));
}

function findById(id) {
  return db("customers").where({ id }).first();
}

function updateCustomer(id, changes) {
  return db("customers").where({ id }).update(
    {
      first_name: changes.first_name,
      last_name: changes.last_name,
      email: changes.email,
      phone: changes.phone,
      company: changes.company,
      updated_at: timestamp,
    },
    ["id", "first_name", "last_name"]
  );
}

function addCustomer(changes) {
  console.log("add customer ", changes);
  return db("customers")
    .insert(
      {
        first_name: changes.first_name,
        last_name: changes.last_name,
        email: changes.email,
        phone: changes.phone,
        company: changes.company,
        created_at: timestamp,
      },
      "id"
    )
    .then((ids) => {
      const [id] = ids;
      return findById(id);
    });
}

function findBy(filter) {
  return db("customers").where(filter);
}

// for validation
function findByEmail(email) {
  return db("customers")
    .select("email")
    .where({
      email,
    })
    .first();
}
