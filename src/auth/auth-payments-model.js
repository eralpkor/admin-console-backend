const db = require("../database/dbConfig");

module.exports = {
  find,
  addOne,
  findById,
  findByJobId,
  deletePayment,
  updateOne,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("payments")
    .select(
      "payments.*",
      "accounts.job_id as JobId",
      "accounts.balance",
      "accounts.total",
      "jobs.job_title"
    )
    .join("jobs", "jobs.id", "accounts.job_id")
    .join("accounts", "accounts.job_id", "payments.account_id")
    .where("payments.is_deleted", false);
}

function findById(id) {
  return db("payments")
    .select()
    .where("id", id)
    .andWhere("is_deleted", false)
    .first();
}

function findByJobId(id) {
  return db("payments")
    .select(
      "payments.*",
      "customers.id as customer_id",
      "users.username as admin",
      "accounts.total",
      "accounts.balance"
    )
    .join("customers", "customers.id", "jobs.customer_id")
    .join("accounts", "accounts.job_id", "payments.account_id")
    .join("users", "users.id", "jobs.admin_id")
    .join("jobs", "jobs.id", "accounts.job_id")
    .where("payments.account_id", id)
    .andWhere("payments.is_deleted", false)
    .first();
}

function addOne(payment) {
  return db
    .transaction(function (t) {
      console.log("object is ", payment.account_id);
      return db("payments")
        .transacting(t)
        .select("payments.*")
        .where(payment.account_id)
        .insert({
          account_id: payment.account_id,
          payment_type: payment.payment_type,
          check_number: payment.check_number,
          amount_paid: payment.amount_paid,
          created_at: timestamp,
        })
        .then(() => {
          let id = payment.account_id;
          console.log("response ", id);
          return db("accounts")
            .transacting(t)
            .where("job_id", id)
            .decrement("balance", payment.amount_paid);
        })
        .then(t.commit)
        .catch(t.rollback);
    })
    .then(() => {
      let id = payment.account_id;
      console.log("transaction succeeded ", id);
      return findById(id);
    })
    .catch((err) => {
      console.log("transaction failed", err);
    });
}

function updateOne(id, data) {
  console.log("whats id data ", id, data);
  return db
    .transaction(function (t) {
      return db("payments")
        .transacting(t)
        .where({ id })
        .update({
          amount_paid: data.amount_paid,
          payment_type: data.payment_type,
          check_number: data.check_number,
          updated_at: timestamp,
        })
        .then(() => {
          return db("payments")
            .transacting(t)
            .sum("amount_paid as sum")
            .where("account_id", data.account_id);
        })
        .then((total) => {
          let sum = total[0].sum;
          console.log("whats id sum ", id, sum);
          return db("accounts")
            .transacting(t)
            .where({
              job_id: data.account_id,
            })
            .update({
              balance: db.raw(`total - ${sum}`),
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

function deletePayment(id) {
  return db("payments").where({ id }).del();
}
