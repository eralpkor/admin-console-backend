const db = require("../database/dbConfig");

module.exports = {
  find,
  addOne,
  // findBy,
  // findByCustomerId,
  // findByUserId,
  // sortByFieldName,
  // findAllJobs,
  findById,
  // updateOne,
  // deleteOne,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("payments")
    .select("payments.*", "accounts.job_id as accountId", "jobs.id as jobId")
    .join("jobs", "jobs.id", "accounts.job_id")
    .join("accounts", "accounts.job_id", "payments.account_id")
    .andWhere("jobs.is_deleted", false);
}

function findById(id) {
  return db("payments")
    .select(
      "payments.*",
      "customers.first_name",
      "customers.last_name",
      "customers.company",
      "users.username as admin",
      "accounts.total",
      "accounts.balance",
      "jobs.customer_id"
    )
    .join("customers", "customers.id", "=", "jobs.customer_id")
    .join("accounts", "accounts.job_id", "jobs.id")
    .join("users", "users.id", "jobs.admin_id")
    .join("jobs", "jobs.customer_id", "accounts.job_id")
    .where("payments.id", id)
    .first();
}

function addOne(payment) {
  return db.transaction(function (t) {
    return db("payments").transacting(t).insert({
      account_id: payment.account_id,
      payment_type: payment.payment_type,
      check_number: payment.check_number,
      amount_paid: payment.amount_paid,
      created_at: timestamp,
    });
  });
}
