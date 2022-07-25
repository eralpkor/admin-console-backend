/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("table_name").del();
  await knex("table_name").insert([
    {
      user_id: 1,
      role_id: 1,
    },
    { id: 2, colName: "rowValue2" },
    { id: 3, colName: "rowValue3" },
  ]);
};
