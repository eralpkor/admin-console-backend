/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("customers", (tbl) => {
    tbl.increments();
    tbl.string("first_name", 128);
    tbl.string("last_name", 128);
    tbl.string("email", 128).unique();
    tbl.string("phone", 50);
    tbl.string("company", 128);
    tbl.string("notes", 258);
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
  return knex.schema.dropTableIfExists("customer");
};
