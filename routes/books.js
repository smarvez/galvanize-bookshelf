'use strict';

const express = require('express');
// const app = express();
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();
const { camelizeKeys, decamelizeKeys } = require('humps');

// YOUR CODE HERE

router.get('/books', (req, res, next) => {
  return knex('books').orderBy('title')
  .then(result => {
    const books = camelizeKeys(result)
    res.status(200).json(books)
  })
})

router.get('/books/:id', (req, res, next) => {
  const id = req.params.id;
  return knex('books').where('id', id).first()
    .then((result) => {
      const book = camelizeKeys(result);
      res.status(200).json(book);
    })
})

router.post('/books', (req, res, next) => {
  const {title, author, genre, description, coverUrl} = req.body;
  const insertBook = {title, author, genre, description, coverUrl};
  return knex('books').insert(decamelizeKeys(insertBook), '*')
    .then((rows) => {
      const book = camelizeKeys(rows[0]);
      res.status(200).send(book);
    })
})

router.patch('/books/:id', (req, res, next) => {
  const id = req.params.id;
  const {title, author, genre, description, coverUrl} = req.body;
  const insertBook = {title, author, genre, description, coverUrl};
  return knex('books').where('id', id).update(decamelizeKeys(insertBook), '*')
    .then((rows) => {
      const book = camelizeKeys(rows[0]);
      res.status(200).send(book)
    })
})

router.delete('/books/:id',(req, res, next) => {
  const id = req.params.id;

  return knex('books')
  .where('id' , id)
  .del()
  .first('updated_at AS updatedAt', 'cover_url AS coverUrl', 'created_at AS createdAt', 'description AS description', 'title AS title', 'genre AS genre', 'author AS author')

  .then((result) => {
  res.status(200).send(result)
  })
})


module.exports = router;
