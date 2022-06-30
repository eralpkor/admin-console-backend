/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema
    .createTable("customer", (tbl) => {
      tbl.increments();
      tbl.string("first_name", 128);
      tbl.string("last_name", 128);
      tbl.string("email", 128).unique();
      tbl.string("phone", 50);
      tbl.string("company", 128);
      tbl.string("notes", 258);
    })
    .createTable("jobs", (tbl) => {
      tbl.increments();
      tbl.string("created_at", 50);
      tbl.string("job_title", 128).notNullable();
      tbl.string("job_description", 1024).notNullable();
      tbl.enu("in_progress", ["open", "in-progress", "closed"]);
      tbl.date("due_date");
      tbl.float("amount", 128);
      tbl
        .integer("customer_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("customer")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.integer("user_id").unsigned().references("users.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("customer").dropTableIfExists("jobs");
};
