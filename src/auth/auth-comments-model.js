const db = require("../database/dbConfig");

module.exports = {
  find,
  findByJobId,
  addOne,
  updateOne,
  findById,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("comments")
    .select("comments.*", "users.username")
    .join("users", "users.id", "comments.added_by");
}

function findByJobId(id) {
  return db("comments")
    .select("comments.*", "users.username as added_by")
    .join("users", "users.id", "comments.added_by")
    .where("comments.job_id", id);
}

function addOne(data) {
  console.log("AddOne data ", data);
  return db("comments")
    .select()
    .insert({
      job_id: data.job_id,
      added_by: data.added_by,
      created_at: timestamp,
      comment: data.comment,
    })
    .then((ids) => {
      return findByJobId(data.job_id);
    })
    .catch((error) => {
      console.log("Error ", error);
    });
}

function findById(id) {
  return db("comments")
    .select("comments.*", "users.username")
    .join("users", "users.id", "comments.added_by")
    .where("comments.id", id)
    .first();
}

function updateOne(id, changes) {
  console.log(id);
  return db("comments")
    .where({ id })
    .update({
      comment: changes.comment,
      updated_at: timestamp,
      added_by: changes.edited_by,
    })
    .then(() => {
      return findById(id);
    });
}
