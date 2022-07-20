/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return (
    knex.schema
      .createTable("accounts", (tbl) => {
        // account and customer number same
        tbl.increments();
        tbl.integer("job_id").unsigned();
        tbl.foreign("job_id").references("jobs.id");
        tbl.float("total");
        tbl.float("balance");
        tbl.timestamp("created_at").defaultTo(knex.fn.now());
        tbl.timestamp("updated_at").defaultTo(knex.fn.now());
        tbl.boolean("is_deleted").defaultTo(false);
      })
      // Payments goes here
      .createTable("account_changes", (tbl) => {
        tbl.increments();
        tbl.integer("account_id").unsigned();
        tbl.foreign("account_id").references("accounts.id");
        tbl.string("payment_type");
        tbl.string("check_number");
        tbl.float("amount_paid");
        tbl.timestamp("created_at").defaultTo(knex.fn.now());
        tbl.timestamp("updated_at").defaultTo(knex.fn.now());
        tbl.boolean("is_deleted").defaultTo(false); // set to true when deleted
      })
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("accounts")
    .dropTableIfExists("account_changes");
};
