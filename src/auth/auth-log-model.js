const db = require("../database/dbConfig");

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

async function create(data) {
  try {
    const ids = await db("log").insert(
      {
        createdAt: timestamp,
        userId: data.userId,
        log: data.log,
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
