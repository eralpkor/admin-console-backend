/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
function time() {
  return new Date();
}

let now = time().toLocaleString();

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const createFakeJobs = () => ({
  changes_id: randomNumber(1, 25),
  changed_at: now,
  amount_paid: 100.45,
});

exports.seed = async function (knex) {
  const fakeChanges = [];
  for (let i = 0; i < 25; i++) {
    fakeChanges.push(createFakeJobs());
  }
  // Deletes ALL existing entries
  await knex("account_changes").del();
  await knex("account_changes").insert(fakeChanges);
};
