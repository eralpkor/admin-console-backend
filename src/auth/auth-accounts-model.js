const db = require("../database/dbConfig");

module.exports = {
  find,
  // addOne,
  findById,
  // updateOne,
};

function find() {
  return db("accounts")
    .select(
      "accounts.*",
      "customers.first_name",
      "customers.last_name",
      "jobs.id as job_id"
    )
    .join("jobs", "jobs.id", "accounts.job_id")
    .join("customers", "customers.id", "jobs.customer_id");
}

function findById(id) {
  return db("accounts").select().where("account_id", id).first();
}
