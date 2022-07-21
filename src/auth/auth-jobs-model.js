const db = require("../database/dbConfig");

module.exports = {
  find,
  addOne,
  findBy,
  findByCustomerId,
  findByUserId,
  sortByFieldName,
  findAllJobs,
  findById,
  updateJob,
  deleteOne,
  findByIdEdit,
  decrementBalance,
};

// ********** JOB related model from here *****************
// Find all jobs and return
function find() {
  return db("jobs");
}
function findAllJobs() {
  return db("jobs")
    .select(
      "jobs.*",
      "customers.first_name",
      "customers.last_name",
      "users.username as assigned_to",
      "accounts.job_id as account_id",
      "accounts.total as total",
      "accounts.balance"
    )
    .join("customers", "customers.id", "jobs.customer_id")
    .join("users", "users.id", "jobs.assigned_to")
    .join("accounts", "accounts.job_id", "jobs.id")
    .andWhere("jobs.is_deleted", false);
}

function addJob(job) {
  return (
    db("jobs")
      .select(
        "jobs.*",
        "customers.first_name",
        "customers.last_name",
        "users.username as assigned_to"
        // new shit
        // "accounts.job_id as account_id",
        // "accounts.total, as total",
        // "accounts.balance, as balance"
      )
      .join("customers", "customers.id", "jobs.customer_id")
      .join("users", "users.id", "jobs.assigned_to")
      // new shit
      // .join("accounts", "jobs.id", "accounts.job_id")
      .insert(job, "id")
      .then((ids) => {
        const [id] = ids;
        return findById(id);
      })
  );
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
        })
        .then((response) => {
          let [id] = response;
          return db("accounts")
            .transacting(t)
            .select("accounts.*")
            .insert({ balance: job.balance, total: job.total, job_id: id });
        })
        .then(t.commit)
        .catch(t.rollback);
    })
    .then((ids) => {
      console.log("transaction succeeded ");
      const [id] = ids;
      return findById(id);
    })
    .catch((err) => {
      console.log("transaction failed", err);
    });
}

function findByIdEdit(id) {
  return db("jobs")
    .select("jobs.*", "comments.*")
    .join("comments", "comments.job_id", "=", "jobs.id")
    .where("jobs.id", "=", id)
    .first();
}

function findById(id) {
  return (
    db("jobs")
      .select()
      // "jobs.*"
      // "customers.first_name",
      // "customers.last_name",
      // "users.username"

      // .join("customers", "customers.id", "jobs.customer_id")

      // .join("users", "users.id", "jobs.assigned_to")
      .where("id", id)
      .first()
  );
}

function findBy(filter) {
  return (
    db("jobs")
      // .select("id", "created_at", "job_title", "job_description", "in_progress", "due")
      .select()
      .where(filter)
      .first()
  );
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

function updateJob(id, changes) {
  return db("jobs").where({ id }).update(changes, "*");
}

function deleteOne(id, update) {
  return db("jobs").where({ id }).del();
}

function decrementBalance(id) {
  return db("jobs").select("balance");
  // return db("jobs")
  //   .select(db.raw("select balance - amount_paid_1"))
  //   .then(function (resp) {
  //     console.log(resp);
  //   });
  // return db("jobs").select(
  // "balance",
  // "-",
  // "amount_paid_1",
  // "-",
  // "amount_paid_2",
  // "-",
  // "amount_paid_3"
  // );
  // .decrement({
  //   balance: 10,
  //   // balance: "amount_paid_2",
  //   // balance: "amount_paid_3",
  // });
}
