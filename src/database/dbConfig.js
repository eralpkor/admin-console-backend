const knex = require("knex");
const config = require("../../knexfile");

// if the environment variable is not set, default to 'development'
const environment = process.env.DB_ENV || "development";

module.exports = knex(config[environment]);
