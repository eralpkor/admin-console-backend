/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("users", (tbl) => {
    tbl.increments();
    tbl.string("username", 128).unique().notNullable();
    tbl.string("password", 128).notNullable();
    tbl.string("email", 128).unique();
    tbl.string("first_name", 50);
    tbl.string("last_name", 128);
    tbl.integer("role_id");
    tbl.boolean("is_deleted").defaultTo(false); // set to true when deleted
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
    tbl.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
