const db = require("../database/dbConfig");
const Payment = require("./auth-payments-model");
module.exports = {
  findMany,
  create,
  find,
  findByCustomerId,
  findByUserId,
  findById,
  update,
  deleteOne,
};
var timestamp = new Date().toLocaleDateString();

// ********** JOB related model from here *****************
// Find all job and return

function findMany() {
  return db("job")
    .select(
      "job.*",
      "customer.firstName",
      "customer.lastName",
      "user.username as username"
    )
    .join("customer", "customer.id", "job.customerId")
    .join("user", "user.id", "job.userId")
    .andWhere("job.isDeleted", false);
}

async function create(job) {
  let ids = [];

  try {
    await db.transaction(async (trx) => {
      ids = await trx("job")
        .insert(
          {
            title: job.title,
            description: job.description,
            inProgress: job.inProgress,
            dueDate: job.dueDate,
            customerId: job.customerId,
            userId: job.userId,
            adminId: job.adminId,
            total: job.total,
            updatedAt: timestamp,
            balance: job.total - job.amountPaid,
          },
          ["id", "userId", "adminId"]
        )
        .transacting(trx);

      const [result] = ids;
      const payment = await trx("payment")
        .insert({
          updatedAt: timestamp,
          userId: job.userId,
          paymentType: job.paymentType,
          amountPaid: job.amountPaid,
          editedBy: job.adminId,
          jobId: ids[0].id,
        })
        .transacting(trx);

      const comment = await trx("comment")
        .insert({
          updatedAt: timestamp,
          comment: job.comment,
          userId: job.userId,
          editedBy: job.adminId,
          jobId: ids[0].id,
        })
        .transacting(trx);

      const log = await trx("log")
        .insert({
          userId: job.userId,
          log: `New job with id ${ids[0].id} added by user id: ${result.adminId}`,
        })
        .transacting(trx);
      console.log("job saved ");
    });
    return findById(ids[0].id);
  } catch (error) {
    console.log(error);
  }
}
// UPDATE job
async function update(id, job) {
  try {
    await db.transaction(async (trx) => {
      const ids = await trx("job")
        .where("job.id", id)
        .update(
          {
            title: job.title,
            description: job.description,
            inProgress: job.inProgress,
            dueDate: job.dueDate,
            customerId: job.customerId,
            userId: job.userId,
            adminId: job.adminId,
            total: job.total,
            updatedAt: timestamp,
          },
          "id"
        )
        .transacting(trx);
      console.log("whats job id ", ids[0].id);
      const payment = await trx("payment")
        .where("payment.jobId", ids[0].id)
        .update(
          {
            updatedAt: timestamp,
            userId: job.userId,
            paymentType: job.paymentType,
            amountPaid: job.amountPaid,
            editedBy: job.adminId,
          },
          ["id", "jobId"]
        )
        .transacting(trx);
      const [result] = payment;
      console.log("whats result ", result);
      // Calculate all payments
      const paymentTotal = await trx("payment")
        .where("jobId", result.jobId)
        .sum("amountPaid as sum")
        .transacting(trx);

      let sum = paymentTotal[0].sum;
      console.log("whats sum ", sum);
      // Calculate the new balance
      const balance = await trx("job")
        .where("id", result.jobId)
        .update({
          balance: db.raw(`job.total - ${sum}`),
        })
        .transacting(trx);
      // Log the transactions
      const log = await trx("log")
        .insert({
          userId: job.userId,
          log: `Job with id ${ids[0].id} updated by user id: ${job.adminId}`,
        })
        .transacting(trx);
      return findById(ids[0].id);
    });
  } catch (error) {
    console.log(error);
  }
}

function find(id) {
  console.log("id in find ", id);
  return db("job").select().where(id).first();
}

function findById(id) {
  console.log("what id ", id);
  return (
    db("job")
      .where("job.id", id)

      .select(
        "job.*",
        "customer.firstName",
        "customer.lastName",
        "user.username as processor"
        // "payment.*",
        // "comment.*"
      )
      .join("customer", "customer.id", "job.customerId")
      .join("user", "user.id", "job.userId")
      // .leftJoin("payment", "payment.jobId", "job.id")
      // .join("comment", "comment.jobId", "job.id")
      .first()
  );
}

// Get job by a single customer.
function findByCustomerId(customerId) {
  return db("job")
    .select("job.*")
    .from("job")
    .join("customer", "customer.id", "job.customerId")
    .where("customerId", customerId);
}

// GET job by user
function findByUserId(user_id) {
  return db("job")
    .select("job.*")
    .from("job")
    .join("user", "user.id", "job.user_id")
    .where("user_id", user_id);
}

function deleteOne(id, update) {
  return db("job").where({ id }).del();
}

// EOF
