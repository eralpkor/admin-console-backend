/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("logs", (tbl) => {
    tbl.increments();
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
    tbl.timestamp("updated_at").defaultTo(knex.fn.now());
    tbl.string("notes", 255);
    tbl.integer("updated_by").unsigned().references("users.id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("logs");
};
