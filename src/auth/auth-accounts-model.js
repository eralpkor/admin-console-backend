const db = require("../database/dbConfig");

module.exports = {
  find,
  addOne,
  findById,
  updateOne,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("accounts")
    .select("accounts.*", "jobs.job_title", "jobs.id as job_id")
    .join("jobs", "jobs.id", "accounts.job_id")
    .andWhere("accounts.is_deleted", false);
}

function findById(id) {
  return (
    db("accounts")
      .select(
        "accounts.*",
        // "customers.first_name",
        // "customers.last_name",
        "jobs.id as job",
        "payments.amount_paid",
        "jobs.job_title"
      )
      .join("jobs", "jobs.id", "accounts.job_id")
      // .join("customers", "customers.id", "jobs.customer_id")
      .join("payments", "payments.account_id", "accounts.job_id")
      .where("job_id", id)
      .first()
  );
}

function updateOne(id, changes) {
  return db
    .transaction(function (t) {
      // accounts
      return db("accounts")
        .transacting(t)
        .select()
        .where({ id })
        .decrement("balance", changes.amount_paid)

        .then((response) => {
          return db("payments")
            .transacting(t)
            .select()
            .where("account_id", id)
            .insert({
              account_id: changes.job_id,
              payment_type: changes.payment_type,
              check_number: changes.check_number,
              amount_paid: changes.amount_paid,
              updated_at: timestamp,
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
