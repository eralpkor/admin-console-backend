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

const createFakeChanges = () => ({
  account_id: randomIds(),
  payment_type: "none",
  amount_paid: 0,
  check_number: "1234567",
});

exports.seed = async function (knex) {
  const fakeChanges = [];
  for (let i = 0; i < 20; i++) {
    fakeChanges.push(createFakeChanges());
  }
  await knex("payments").del();
  await knex("payments").insert(fakeChanges);
};
