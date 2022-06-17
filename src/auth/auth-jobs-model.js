const db = require("../database/dbConfig");

module.exports = {
  find,
  addJob,
  findBy,
  findByCustomerId,
};

// ********** JOB related model from here *****************
// Find all jobs and return
function find() {
  return db("jobs");
}

function addJob(job) {
  return db("jobs")
    .insert(job, "id")
    .then((ids) => {
      const [id] = ids;
      return findById(id);
    });
}

function findById(id) {
  return db("jobs").select("id", "job_title").where({ id }).first();
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
    .join("customer", "customer.id", "jobs.customer_id")
    .where("customer_id", customer_id);
}
