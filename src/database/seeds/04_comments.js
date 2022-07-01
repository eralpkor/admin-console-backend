/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const faker = require("faker");

function time() {
  return new Date();
}

let now = time().toLocaleString();
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const createFakeComments = () => ({
  comment: faker.random.words(10),
  job_id: randomNumber(1, 50),
  created_at: now,
});

exports.seed = async function (knex) {
  const fakeComments = [];
  const desiredFakeComments = 50;
  for (let i = 0; i < desiredFakeComments; i++) {
    fakeComments.push(createFakeComments());
  }
  // Deletes ALL existing entries
  await knex("comments").del();
  await knex("comments").insert(fakeComments);
};
