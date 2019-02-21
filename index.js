const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// [POST] /api/cohorts 

server.post('/api/cohorts', (req, res) => {
    const cohort = req.body;
    if(!cohort.name){
        res.status(400).json({ error: 'Please provide cohort name' })
    } else {
        db('cohorts') 
            .insert(cohort)
            .then(id => {
                res.status(201).json({ id: id[0] })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: 'Could not add cohort' })
            })
    }
});

// [GET] /api/cohorts

server.get('/api/cohorts', (req, res) => {
    db('cohorts')
        .then(cohorts => {
            res.status(200).json({ cohorts })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Could not get cohorts' })
        })
});

// [GET] /api/cohorts/:id 

server.get('/api/cohorts/:id', (req, res) => {
    db('cohorts')
        .where({ id: req.params.id })
        .first()
        .then(cohort => {
            cohort ?
            res.status(200).json({ cohort })
            : res.status(404).json({ error: 'Cohort with that ID does not exist' })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Could not get cohort' })
        })
});

// [GET] /api/cohorts/:id/students returns all students for the cohort with the specified id.

server.get('/api/cohorts/:id/students', (req, res) => {
    db('students')
        .where({ cohort_id: req.params.id })
        .then(students => {
            res.status(200).json({ students })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Could not get students' })
        })
});

// [PUT] /api/cohorts/:id This route will update the cohort with the matching id using information sent in the body of the request.

server.put('/api/cohorts/:id', (req, res) => {
    const changes = req.body;
    db('cohorts')
      .where({ id: req.params.id})
      .update(changes)
      .then(didUpdate => {
        didUpdate ?
        res.status(200).json({ message: 'Cohort updated' })
        : res.status(404).json({ error: 'Cohort with that id does not exist' })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Could not update cohort' })
      })
  });

// [DELETE] /api/cohorts/:id This route should delete the specified cohort.

server.delete('/api/cohorts/:id', (req, res) => {
    db('cohorts')
      .where({ id: req.params.id})
      .del()
      .then(count => {
        count ?
        res.status(204).end()
        : res.status(404).json({ error: 'Cohort with that ID does not exist' })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Could not remove cohort' })
      })
  });

  // ********* students 

  server.get('/api/students', (req, res) => {
    db('students')
        .join('cohorts','students.cohort_id', 'cohorts.id')
        .select('students.name', 'cohorts.name AS cohort', 'students.id')
        .then(students => {
            res.status(200).json({ students })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Could not get students' })
        })
});

const port = process.env.PORT || 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});