const db = require("../database/dbConfig");
module.exports = {
  findMany,
  create,
  // findBy,
  findByCustomerId,
  findByUserId,
  sortByFieldName,
  findById,
  updateOne,
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
  try {
    await db.transaction(async (trx) => {
      const ids = await trx("job")
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
          "id"
        )
        .transacting(trx);
      let [id] = ids;
      console.log("whats ids ", id.id);
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
      console.log("job saved ");
      return findById(ids[0].id);
    });
  } catch (error) {
    console.log(error);
  }
}

function findById(id) {
  console.log("what id ", id);
  return db("job")
    .where("job.id", id)

    .select(
      "job.*",
      "customer.firstName",
      "customer.lastName",
      "user.username as processor",
      "payment.*",
      "comment.*"
    )
    .join("customer", "customer.id", "job.customerId")
    .join("user", "user.id", "job.userId")
    .join("payment", "payment.jobId", "job.id")
    .join("comment", "comment.jobId", "job.id")
    .first();
}

async function updateOne(id, data) {
  const job = await findById(id);
  console.log("whats job", job);
}

// function updateOne(id, job) {
//   return db
//     .transaction(function (t) {
//       return db("job")
//         .where({ id })
//         .transacting(t)
//         .select()
//         .update({
//           title: job.title,
//           description: job.description,
//           inProgress: job.inProgress,
//           dueDate: job.dueDate,
//           customerId: job.customerId,
//           userId: job.userId,
//           adminId: job.adminId,
//           updated_at: timestamp,
//         })
//         .then(() => {
//           console.log("whats id ", id);
//           return db("payments")
//             .transacting(t)
//             .sum("amount_paid as sum")
//             .where("account_id", id);
//         })
//         .then((amountPaid) => {
//           let { sum } = amountPaid[0];
//           console.log("whats sum id ", sum, id);
//           return db("account")
//             .transacting(t)
//             .where({ id })
//             .update({
//               total: job.total,
//               balance: db.raw(`total - ${sum}`),
//             });
//         })
//         .then(t.commit)
//         .catch(t.rollback);
//     })
//     .then(() => {
//       console.log("transaction succeeded ", id);
//       return findById(id);
//     })
//     .catch((err) => {
//       console.log("transaction failed", err);
//     });
// }

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

// GET job by progress/status desc or asc
function sortByFieldName(sortByName, direction) {
  return db("job").select().orderBy(sortByName, direction);
  // .orderBy("title", "asc");
}

function deleteOne(id, update) {
  return db("job").where({ id }).del();
}

// EOF
