'use strict';

const express = require('express');

const { router: usersRouter, clearUsers } = require('./routes/users');
const { router: expensesRouter, clearExpenses } = require('./routes/expenses');

function createServer() {
  const app = express();

  clearUsers();
  clearExpenses();

  app.use(express.json());
  app.use('/users', usersRouter);
  app.use('/expenses', expensesRouter);

  return app;
}

module.exports = {
  createServer,
};
