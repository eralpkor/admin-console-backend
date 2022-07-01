/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("accounts", (tbl) => {
      tbl.increments();
      // account and customer number same
      tbl
        .integer("account_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("jobs")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.float("amount");
      tbl.float("balance");

      tbl.check("?? >= ??", ["amount", "balance"]);
      tbl.string("created_at");
    })
    .createTable("account_changes", (tbl) => {
      tbl
        .integer("changes_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("accounts");
      tbl.string("changed_at");
      tbl.float("amount_paid");
    });
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
