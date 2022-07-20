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
  job_id: randomNumber(1, 20),
});

exports.seed = async function (knex) {
  const fakeComments = [];
  const desiredFakeComments = 20;
  for (let i = 0; i < desiredFakeComments; i++) {
    fakeComments.push(createFakeComments());
  }
  // Deletes ALL existing entries
  await knex("comments").del();
  await knex("comments").insert(fakeComments);
};
