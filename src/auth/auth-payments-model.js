const db = require("../database/dbConfig");

module.exports = {
  find,
  create,
  findById,
  findByJobId,
  deletePayment,
  update,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("payment")
    .select("payment.*", "user.username as editedBy", "job.title")
    .join("user", "user.id", "payment.editedBy")
    .join("job", "job.id", "payment.jobId")
    .where("payment.isDeleted", false);
}

function findById(id) {
  return db("payment").select("*").where("payment.id", id).first();
}

function findByJobId(id) {
  return db("payment")
    .select("payment.*", "job.*", "user.username as admin")
    .join("user", "user.id", "payment.editedBy")
    .join("job", "job.id", "payment.jobId")
    .where("payment.jobId", id)
    .andWhere("payment.isDeleted", false);
}

async function create(payment) {
  let ids = [];
  try {
    await db.transaction(async (trx) => {
      ids = await trx("payment")
        .insert(
          {
            jobId: payment.jobId,
            paymentType: payment.paymentType,
            amountPaid: payment.amountPaid,
            userId: payment.userId,
            editedBy: payment.editedBy,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          "id"
        )
        .transacting(trx);
      const [id] = ids;
      const paymentTotal = await trx("payment")
        .where("jobId", payment.jobId)
        .sum("amountPaid as sum")
        .transacting(trx);

      let sum = paymentTotal[0].sum;
      const balance = await trx("job")
        .where("id", payment.jobId)
        .update({
          balance: db.raw(`total - ${sum}`),
        })
        .transacting(trx);
    });
    return findById(ids[0].id);
  } catch (error) {
    console.log(error);
  }
}

async function update(id, payment) {
  try {
    await db.transaction(async (trx) => {
      const ids = await trx("payment")
        .where({ id })
        .update(
          {
            paymentType: payment.paymentType,
            amountPaid: payment.amountPaid,
            editedBy: payment.editedBy,
            updatedAt: timestamp,
          },
          ["id", "jobId"]
        )
        .transacting(trx);

      const [result] = ids;
      const paymentTotal = await trx("payment")
        .where("jobId", result.jobId)
        .sum("amountPaid as sum")
        .transacting(trx);

      let sum = paymentTotal[0].sum;
      const balance = await trx("job")
        .where("id", result.jobId)
        .update({
          balance: db.raw(`total - ${sum}`),
        })
        .transacting(trx);
      return findById(result.id);
    });
  } catch (error) {
    console.log(error);
  }
}

function deletePayment(id) {
  return db("payment").where({ id }).del();
}
