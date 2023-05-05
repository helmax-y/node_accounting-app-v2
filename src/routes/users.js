'use strict';

const express = require('express');

const router = express.Router();

let users = [];

const getAllUsers = () => {
  return users;
};

const clearUsers = () => {
  users = [];
};

router.get('/', (req, res) => {
  res.send(users);
});

router.post('/', (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.sendStatus(400);

    return;
  }

  const newUser = {
    id: Math.floor(Math.random() * 100000),
    name,
  };

  users.push(newUser);

  res.statusCode = 201;
  res.send(newUser);
});

router.get('/:id', (req, res) => {
  const matchedUser = users.find((user) => user.id === +req.params.id);

  if (!matchedUser) {
    res.sendStatus(404);
  }

  res.send(matchedUser);
});

router.delete('/:id', (req, res) => {
  const updatedUsers = users.filter(user => user.id !== +req.params.id);

  if (users.length === updatedUsers.length) {
    res.sendStatus(404);

    return;
  }

  users = updatedUsers;

  res.sendStatus(204);
});

router.patch('/:id', (req, res) => {
  const isUser = users.some(user => user.id === +req.params.id);

  if (!isUser) {
    res.sendStatus(404);

    return;
  }

  const updatedUser = {
    id: +req.params.id,
    name: req.body.name,
  };

  users = users.map(user => user.id === +req.params.id ? updatedUser : user);

  res.send(updatedUser);
});

module.exports = {
  router,
  getAllUsers,
  clearUsers,
};
