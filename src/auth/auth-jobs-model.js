const db = require("../database/dbConfig");
module.exports = {
  find,
  addOne,
  // findBy,
  findByCustomerId,
  findByUserId,
  sortByFieldName,
  findById,
  updateOne,
  deleteOne,
  // findByIdEdit,
};
var timestamp = new Date().toLocaleDateString();

// ********** JOB related model from here *****************
// Find all jobs and return

function find() {
  return db("jobs")
    .select(
      "jobs.*",
      "customers.first_name",
      "customers.last_name",
      "users.username as assigned_to",
      "accounts.total as total",
      "accounts.balance"
    )
    .join("customers", "customers.id", "jobs.customer_id")
    .join("users", "users.id", "jobs.assigned_to")
    .join("accounts", "accounts.job_id", "jobs.id")
    .andWhere("jobs.is_deleted", false);
}

function addOne(job) {
  return db
    .transaction(function (t) {
      return db("jobs")
        .transacting(t)
        .select("jobs.*")
        .insert({
          job_title: job.job_title,
          job_description: job.job_description,
          in_progress: job.in_progress,
          due_date: job.due_date,
          customer_id: job.customer_id,
          assigned_to: job.assigned_to,
          admin_id: job.admin_id,
          created_at: timestamp,
        })
        .then((response) => {
          let [id] = response;
          return db("accounts")
            .transacting(t)
            .select()
            .insert({
              job_id: id,
              balance: job.total - job.amount_paid,
              total: job.total,
            });
        })
        .then((response) => {
          let [id] = response;
          return db("payments").transacting(t).select().returning(id).insert({
            account_id: id,
            payment_type: job.payment_type,
            check_number: job.check_number,
            amount_paid: job.amount_paid,
            added_by: job.added_by,
          });
        })
        .then(t.commit)
        .catch(t.rollback);
    })
    .then((response) => {
      // const [id] = ids;
      // console.log("whats response ", response);
      console.log("transaction succeeded ", id);
      return findById(id);
    })
    .catch((err) => {
      console.log("transaction failed", err);
    });
}

function findById(id) {
  return db("jobs")
    .select(
      "jobs.*",
      "customers.first_name",
      "customers.last_name",
      "users.username",
      "accounts.total",
      "accounts.balance",
      "accounts.job_id"
    )
    .join("customers", "customers.id", "jobs.customer_id")
    .join("users", "users.id", "jobs.assigned_to")
    .join("accounts", "accounts.job_id", "jobs.id")
    .where("jobs.id", id)
    .first();
}

function updateOne(id, job) {
  return db
    .transaction(function (t) {
      return db("jobs")
        .where({ id })
        .transacting(t)
        .select()
        .update({
          job_title: job.job_title,
          job_description: job.job_description,
          in_progress: job.in_progress,
          due_date: job.due_date,
          customer_id: job.customer_id,
          assigned_to: job.assigned_to,
          admin_id: job.admin_id,
          updated_at: timestamp,
        })
        .then(() => {
          return db("accounts")
            .transacting(t)
            .select()
            .where({ id })
            .update({
              total: job.total,
              balance: job.total - job.amount_paid,
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

// Get jobs by a single customer.
function findByCustomerId(customer_id) {
  return db("jobs")
    .select("jobs.*")
    .from("jobs")
    .join("customers", "customers.id", "jobs.customer_id")
    .where("customer_id", customer_id);
}

// GET jobs by user
function findByUserId(user_id) {
  return db("jobs")
    .select("jobs.*")
    .from("jobs")
    .join("users", "users.id", "jobs.user_id")
    .where("user_id", user_id);
}

// GET jobs by progress/status desc or asc
function sortByFieldName(sortByName, direction) {
  return db("jobs").select().orderBy(sortByName, direction);
  // .orderBy("job_title", "asc");
}

function deleteOne(id, update) {
  return db("jobs").where({ id }).del();
}

// EOF
