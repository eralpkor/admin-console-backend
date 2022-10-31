const db = require("../database/dbConfig");
const User = require("./auth-model");
const Job = require("./auth-jobs-model");

module.exports = {
  find,
  create,
  findById,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("log").select();
}

function findById(id) {
  return db("log").select().where({ id }).first();
}

async function create(data, userId, jobId) {
  const job = Job.findById(jobId);
  const user = User.findById(userId);
  try {
    const ids = await db("log").insert(
      {
        createdAt: timestamp,
        userId: user.id,
        log: { ...data },
      },
      "id"
    );
    const [result] = ids;
    console.log("result ", result.id);
    return findById(result.id);
  } catch (error) {
    console.log("Comment error ", error);
  }
}
