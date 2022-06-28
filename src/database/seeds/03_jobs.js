/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("jobs").del();
  await knex("jobs").insert([
    {
      job_title: "Tax return",
      job_description:
        "We need to get his tax return ans minus thlsdf sdfsdf sdkfh sdhflsdf ",
      due_date: "6/19/2022",
      amount: "255.78",
      customer_id: 1,
      user_id: 2,
      in_progress: true,
      //   customer_first: "Michael",
      //   customer_last: "Jackson",
      //   user_name: "eralp",
    },
    {
      job_title: "Someting else",
      job_description: "Something is not right with his hair ans fudge  ",
      due_date: "6/11/2022",
      amount: "300.00",
      customer_id: 2,
      user_id: 1,
      in_progress: false,
      // customer_first: "Susan",
      // customer_last: "Elain",
      // user_name: "jatinder",
    },
  ]);
};
