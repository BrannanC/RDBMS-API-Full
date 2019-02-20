
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').del()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {name: 'Bob', cohort_id: 1},
        {name: 'Jane', cohort_id: 1},
        {name: 'Sue', cohort_id: 1},
        {name: 'Mary', cohort_id: 2},
        {name: 'Jo', cohort_id: 2},
        {name: 'Joe', cohort_id: 3},
        {name: 'Ryan', cohort_id: 4},
      ]);
    });
};
