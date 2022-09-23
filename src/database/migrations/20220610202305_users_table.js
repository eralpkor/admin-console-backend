/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("user", (tbl) => {
    tbl.increments();
    tbl.string("username", 128).unique().notNullable();
    tbl.string("password", 128).notNullable();
    tbl.string("email", 128).unique();
    tbl.string("firstName", 50);
    tbl.string("lastName", 128);
    tbl.date("createdAt").defaultTo(knex.fn.now());
    tbl.boolean("isDeleted").defaultTo(false); // set to true when deleted
    tbl.enu("role", ["SUPERADMIN", "ADMIN", "USER"]).defaultTo("USER");
    tbl.timestamp("updatedAt");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user");
};
