/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("roles").del();
  await knex("roles").insert([
    { role: "superAdmin" },
    { role: "admin" },
    { role: "user" },
  ]);
};
