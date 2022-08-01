/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user_roles").del();
  await knex("user_roles").insert([
    {
      user_role_id: 1,
      user_id: 1,
      role_id: 1,
    },
    {
      user_role_id: 2,
      user_id: 2,
      role_id: 1,
    },
    {
      user_role_id: 3,
      user_id: 3,
      role_id: 2,
    },
    {
      user_role_id: 4,
      user_id: 4,
      role_id: 3,
    },
    {
      user_role_id: 5,
      user_id: 5,
      role_id: 3,
    },
    {
      user_role_id: 6,
      user_id: 6,
      role_id: 3,
    },
    {
      user_role_id: 7,
      user_id: 7,
      role_id: 3,
    },
  ]);
};
