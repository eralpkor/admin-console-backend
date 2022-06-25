const db = require("../database/dbConfig");

module.exports = {
  find,
  // addJob,
  // findBy,
  // findByCustomerId,
  // findByUserId,
  // sortByFieldName,
  // findAllJobs,
};

function find() {
  return db("customer");
}
