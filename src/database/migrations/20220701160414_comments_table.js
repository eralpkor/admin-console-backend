/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("comments", (tbl) => {
    tbl.increments();
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
    tbl.timestamp("updated_at").defaultTo(knex.fn.now());
    tbl.string("comment", 512);
    tbl.boolean("is_deleted").defaultTo(false); // set to true when deleted
    tbl.integer("job_id").unsigned().references("id").inTable("jobs");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("comments");
};
