const db = require("../database/dbConfig");

module.exports = {
  find,
  addOne,
  findById,
  updateOne,
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
    .join("customers", "customers.id", "jobs.customer_id")
    .andWhere("accounts.is_deleted", false);
}

function findById(id) {
  return db("accounts").select().where("job_id", id).first();
}

function updateOne(id, changes) {
  return db("accounts").where({ id }).update(changes, "*");
}

function addOne(account) {
  return db("accounts")
    .select("accounts.*", "customers.first_name", "customers.last_name")
    .join("jobs", "jobs.id", "accounts.job_id")
    .join("customers", "customers.id", "jobs.customer_id")
    .insert(account, "id")
    .then((ids) => {
      const [id] = ids;
      return findById(id);
    });
}
