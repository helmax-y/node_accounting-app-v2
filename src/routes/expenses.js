'use strict';

const express = require('express');

const { getAllUsers } = require('./users');

const router = express.Router();

let expenses = [];

const clearExpenses = () => {
  expenses = [];
};

router.get('/', (req, res) => {
  const { userId, categories, from, to } = req.query;
  let matchedExpenses = [...expenses];

  if (userId) {
    matchedExpenses = matchedExpenses.filter(
      item => item.userId === +userId
    );
  }

  if (Array.isArray(categories)) {
    matchedExpenses = matchedExpenses.filter(
      item => categories.includes(item.category)
    );
  }

  if (typeof categories === 'string') {
    matchedExpenses = matchedExpenses.filter(
      item => categories === item.category
    );
  }

  if (from) {
    matchedExpenses = matchedExpenses.filter(
      item => new Date(item.spentAt).getTime() >= new Date(from).getTime()
    );
  }

  if (to) {
    matchedExpenses = matchedExpenses.filter(
      item => new Date(item.spentAt).getTime() <= new Date(to).getTime()
    );
  }

  res.send(matchedExpenses);
});

router.post('/', (req, res) => {
  const newExpense = req.body;
  const users = getAllUsers();

  if (!newExpense.spentAt
    || !newExpense.title
    || !newExpense.category
    || !newExpense.note
    || typeof newExpense.amount === 'undefined'
    || typeof newExpense.userId === 'undefined'
    || !users.some(user => user.id === +newExpense.userId)
  ) {
    res.sendStatus(400);

    return;
  }

  newExpense.id = Math.floor(Math.random() * 100000);

  expenses.push(newExpense);

  res.statusCode = 201;
  res.send(newExpense);
});

router.get('/:id', (req, res) => {
  const foundExpense = expenses.find(item => item.id === +req.params.id);

  if (!foundExpense) {
    res.sendStatus(404);

    return;
  }

  res.send(foundExpense);
});

router.delete('/:id', (req, res) => {
  const updatedExpenses = expenses.filter(item => item.id !== +req.params.id);

  if (updatedExpenses.length === expenses.length) {
    res.sendStatus(404);

    return;
  }

  expenses = updatedExpenses;

  res.sendStatus(204);
});

router.patch('/:id', (req, res) => {
  const foundExpense = expenses.find(item => item.id === +req.params.id);

  if (!foundExpense) {
    res.sendStatus(404);

    return;
  }

  const updatedExpense = {
    ...foundExpense,
    ...req.body,
  };

  expenses = expenses.map(
    item => item.id === +req.params.id ? updatedExpense : item
  );

  res.send(updatedExpense);
});

module.exports = {
  router,
  clearExpenses,
};
