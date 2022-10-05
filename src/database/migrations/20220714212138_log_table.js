/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("log", (tbl) => {
    tbl.increments();
    tbl.date("createdAt").defaultTo(knex.fn.now());
    tbl
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user");
    tbl.string("log", 256);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("log");
};
