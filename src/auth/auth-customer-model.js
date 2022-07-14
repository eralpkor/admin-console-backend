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

function find() {
  return db("customers");
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
  console.log(filter);
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
