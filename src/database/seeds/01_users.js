/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// seed:run --specific=
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
      is_admin: 1,
    },
    {
      username: "eralp",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Eralp",
      last_name: "Kor",
      email: "eralp.ny@gmail.com",
      is_admin: 1,
    },
    {
      username: "sunny",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Sunny",
      last_name: "Kor",
      email: "sunny@gmail.com",
      is_admin: 0,
    },
    {
      username: "susan",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Susan",
      last_name: "Kor",
      email: "susan@gmail.com",
      is_admin: 0,
    },
  ]);
};
