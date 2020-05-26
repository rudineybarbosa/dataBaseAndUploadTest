import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import Transaction from '../models/Transaction';
// import Transaction from '../models/Transaction';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

interface TransactionToValidate {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
const transactionsRouter = Router();

// const transactionRepository = new TransactionsRepository();

transactionsRouter.get('/', async (request, response) => {
  return response.json({ ok: 'rudiney get' });
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function validate({ title, type, value, category }: TransactionToValidate) {
  if (title === undefined || title === '') {
    throw new AppError('Title is required');
  }

  if (type === undefined) {
    throw new AppError('Title is required');
  }

  if (type !== 'income' && type !== 'outcome') {
    throw new AppError('Type invalid');
  }

  if (value === undefined || value === 0) {
    throw new AppError('Value is required');
  }
  if (category === undefined) {
    throw new AppError('Category is required');
  }
}

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;

  validate({ title, type, value, category });
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactionService = new CreateTransactionService(
    transactionRepository,
  );
  const transaction = await transactionService.execute({
    title,
    type,
    value,
    category,
  });

  return response.json({ transaction });
});

transactionsRouter.delete('/:id', async (request, response) => {
  return response.json({ ok: 'rudiney delete' });
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
  return response.json({ ok: 'rudiney import' });
});

export default transactionsRouter;
