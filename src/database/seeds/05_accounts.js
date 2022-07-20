/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

var num = 0;
function fakeIds(value) {
  return (num += value);
}

function randomIds() {
  for (let i = 0; i < 20; i++) {
    return fakeIds(1);
  }
}

const createFakeAccounts = () => ({
  job_id: randomIds(),
  total: 100,
  balance: 100,
});

exports.seed = async function (knex) {
  const fakeAccounts = [];
  for (let i = 0; i < 20; i++) {
    fakeAccounts.push(createFakeAccounts());
  }
  await knex("accounts").del();
  await knex("accounts").insert(fakeAccounts);
};
