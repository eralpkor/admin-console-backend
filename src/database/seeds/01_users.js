/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// seed:run --specific=
const bcrypt = require("bcryptjs");
require("dotenv").config();
var timestamp = new Date().toLocaleDateString();

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user").del();
  await knex("user").insert([
    {
      username: "jatinder",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      firstName: "Jatinder",
      lastName: "Sharma",
      email: "jatinder@aexperts.com",
      isDeleted: false,
      role: "SUPERADMIN",
      updatedAt: timestamp,
    },
    {
      username: "eralp",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      firstName: "Eralp",
      lastName: "Kor",
      email: "eralp.ny@gmail.com",
      isDeleted: false,
      role: "SUPERADMIN",
      updatedAt: timestamp,
    },
    {
      username: "sunny",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      firstName: "Sunny",
      lastName: "Kor",
      email: "sunny@gmail.com",
      isDeleted: false,
      role: "ADMIN",
      updatedAt: timestamp,
    },
    {
      username: "susan",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      firstName: "Susan",
      lastName: "Kor",
      email: "susan@gmail.com",
      isDeleted: false,
      role: "USER",
      updatedAt: timestamp,
    },
    {
      username: "johnathan",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      firstName: "Jon",
      lastName: "Got",
      email: "John@gmail.com",
      isDeleted: false,
      role: "USER",
      updatedAt: timestamp,
    },
    {
      username: "kai_kor",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      firstName: "Kai",
      lastName: "Kor",
      email: "kai@gmail.com",
      isDeleted: false,
      role: "USER",
      updatedAt: timestamp,
    },
    {
      username: "norman",
      password: bcrypt.hashSync(process.env.USER_PASSWORD, 8),
      firstName: "Norman",
      lastName: "Kor",
      email: "norman1@gmail.com",
      isDeleted: false,
      role: "USER",
      updatedAt: timestamp,
    },
  ]);
};
