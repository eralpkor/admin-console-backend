const db = require("../database/dbConfig");

module.exports = {
  find,
  // addJob,
  findBy,
  findByCustomerId,
  // findByUserId,
  // sortByFieldName,
  // findAllJobs,
  updateCustomer,
  getCustomer,
  addCustomer,
  findByEmail,
};

// SELECT *, first_name || " " || last_name AS FullName FROM customers
// var colums = knex.raw(
//   'SELECT *, first_name || " " || last_name AS FullName FROM customers'
// );
function find() {
  return db("customers")
    .select("customers.*")
    .columns(db.raw("first_name || ' ' || last_name AS full_name"));
}

function findByCustomerId(id) {
  return db("customers").where({ id }).first();
}

function updateCustomer(id, changed) {
  return db("customers")
    .where({ id })
    .update(changed, ["id", "first_name", "last_name"]);
}

function getCustomer(id) {
  return db("customers").select().where({ id }).first();
}

function addCustomer(params) {
  return db("customers")
    .insert(params, "id")
    .then((ids) => {
      const [id] = ids;
      return findByCustomerId(id);
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
