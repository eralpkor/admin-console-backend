/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("customer", (tbl) => {
    tbl.increments();
    tbl.date("createdAt").defaultTo(knex.fn.now());
    tbl.date("updatedAt");
    tbl.string("email", 128).unique();
    tbl.string("firstName", 128);
    tbl.string("lastName", 128);
    tbl.string("phone", 128);
    tbl.string("company", 128);
    tbl.string("comment", 256);
    tbl.boolean("isDeleted").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("customer");
};
