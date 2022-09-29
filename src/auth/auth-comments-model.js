const db = require("../database/dbConfig");

module.exports = {
  find,
  findByJobId,
  create,
  update,
  findById,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("comment")
    .select("comment.*", "user.username")
    .join("user", "user.id", "comment.editedBy")
    .andWhere("comment.isDeleted", false);
}

function findByJobId(id) {
  return db("comment")
    .select("comment.*", "user.username as editedBy")
    .join("user", "user.id", "comment.editedBy")
    .where("comment.jobId", id);
}

// CREATE a new comment
async function create(data) {
  try {
    await db.transaction(async (trx) => {
      const ids = await trx("comment")
        .insert(
          {
            jobId: data.jobId,
            userId: data.userId,
            createdAt: timestamp,
            updatedAt: timestamp,
            comment: data.comment,
            editedBy: data.editedBy,
          },
          ["id", "jobId", "userId", "editedBy"]
        )
        .transacting(trx);

      const [result] = ids;
      const log = await trx("log")
        .insert({
          userId: result.userId,
          log: `New comment with id ${ids[0].id} added by user id: ${result.adminId}`,
        })
        .transacting(trx);
    });
    return findByJobId(data.jobId);
  } catch (error) {
    console.log("Comment error ", error);
  }
}

// EDIT comment
async function update(id, changes) {
  try {
    await db.transaction(async (trx) => {
      const ids = await trx("comment")
        .where({ id })
        .update(
          {
            comment: changes.comment,
            updatedAt: timestamp,
            editedBy: changes.editedBy,
          },
          ["id", "editedBy"]
        )
        .transacting(trx);
      const [result] = ids;
      console.log("result ", result);
      const log = await trx("log")
        .insert({
          userId: result.editedBy,
          log: `Comment with id ${ids[0].id} edited by user id: ${result.editedBy}`,
        })
        .transacting(trx);
    });
    return findById(id);
  } catch (error) {
    console.log("Comment edit error ", error);
  }
}

function findById(id) {
  return db("comment")
    .select("comment.*", "user.username")
    .join("user", "user.id", "comment.editedBy")
    .where("comment.id", id)
    .first();
}
