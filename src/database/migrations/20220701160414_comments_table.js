/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("comments", (tbl) => {
    tbl.increments();
    tbl.string("created_at", 50);
    tbl.string("comment", 512);
    tbl
      .integer("job_id")
      .unsigned()
      .references("id")
      .inTable("jobs")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("comments");
};
