/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      username: "jatinder",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Jatinder",
      last_name: "Sharma",
      email: "jatinder@aexperts.com",
    },
    {
      username: "eralp",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Eralp",
      last_name: "Kor",
      email: "eralp.ny@gmail.com",
    },
  ]);
};
