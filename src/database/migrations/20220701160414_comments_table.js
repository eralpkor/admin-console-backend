/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("comment", (tbl) => {
    tbl.increments();
    tbl.date("createdAt").defaultTo(knex.fn.now());
    tbl.date("updatedAt");
    tbl.string("comment", 1025);
    tbl
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user");
    tbl.integer("editedBy");
    tbl
      .integer("jobId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("job");
    tbl.boolean("isDeleted").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("comment");
};
