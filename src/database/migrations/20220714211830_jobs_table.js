/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // JOBS table
  return knex.schema.createTable("jobs", (tbl) => {
    tbl.increments();
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
    tbl.timestamp("updated_at").defaultTo(knex.fn.now());
    tbl.date("due_date", 50);
    tbl.string("job_title", 128).notNullable();
    tbl.string("job_description", 1024).notNullable();
    tbl.enu("in_progress", ["open", "in-progress", "closed"]);
    tbl.boolean("is_deleted").defaultTo(false);
    // assign to user-processor
    tbl
      .integer("assigned_to")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    tbl
      .integer("customer_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("customers");
    tbl
      .integer("admin_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("jobs");
};
