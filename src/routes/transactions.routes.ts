import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
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
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.allWithCascadeRelations();
  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
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

  const transactionService = new CreateTransactionService();

  const responseDTO = await transactionService.execute({
    title,
    type,
    value,
    category,
  });

  return response.json({ responseDTO });
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
  return response.json({ ok: 'rudiney import' });
});

export default transactionsRouter;
