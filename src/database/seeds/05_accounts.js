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

const createFakeAccounts = () => ({
  account_id: randomNumber(1, 50),
  amount: 500,
  balance: 200,
  created_at: now,
});

exports.seed = async function (knex) {
  const fakeAccounts = [];
  for (let i = 0; i < 25; i++) {
    fakeAccounts.push(createFakeAccounts());
  }
  // Deletes ALL existing entries
  await knex("accounts").del();
  await knex("accounts").insert(fakeAccounts);
};
