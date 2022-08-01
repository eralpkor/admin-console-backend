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
      role_id: 1,
      is_deleted: false,
    },
    {
      username: "eralp",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Eralp",
      last_name: "Kor",
      email: "eralp.ny@gmail.com",
      role_id: 1,
      is_deleted: false,
    },
    {
      username: "sunny",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Sunny",
      last_name: "Kor",
      email: "sunny@gmail.com",
      role_id: 2,
      is_deleted: false,
    },
    {
      username: "susan",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Susan",
      last_name: "Kor",
      email: "susan@gmail.com",
      role_id: 3,
      is_deleted: false,
    },
    {
      username: "johnathan",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Jon",
      last_name: "Got",
      email: "John@gmail.com",
      role_id: 3,
      is_deleted: false,
    },
    {
      username: "kai_kor",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Kai",
      last_name: "Kor",
      email: "kai@gmail.com",
      role_id: 3,
      is_deleted: false,
    },
    {
      username: "norman",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      first_name: "Norman",
      last_name: "Kor",
      email: "norman1@gmail.com",
      role_id: 3,
      is_deleted: false,
    },
  ]);
};
