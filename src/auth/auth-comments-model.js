const db = require("../database/dbConfig");

module.exports = {
  find,
  findByJobId,
  addOne,
};

var timestamp = new Date().toLocaleDateString();

function find() {
  return db("comments").select();
}

function findByJobId(id) {
  return db("comments").select().where("comments.job_id", id);
}

function addOne(data) {
  console.log("AddOne data ", data);
  return db("comments")
    .select()
    .insert({
      job_id: data.job_id,
      created_at: timestamp,
      comment: data.comment,
    })
    .then((ids) => {
      const id = [ids];
      console.log("whats ids ", ids);
      return findByJobId(data.job_id);
    })
    .catch((error) => {
      console.log("Error ", error);
    });
}
