import { Router } from 'express';
import AppError from '../errors/AppError';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  return response.json({ ok: 'rudiney get' });
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function validate(
  title: string,
  type: string,
  value: number,
  category: string,
) {
  if (title === undefined || title === '') {
    throw new AppError('Title is required');
  }

  if (type === undefined || type === '') {
    throw new AppError('Title is required');
  }

  if (type !== 'income' && type !== 'outcome') {
    throw new AppError('Type invalid');
  }

  if (value === undefined || value === 0) {
    throw new AppError('Value is required');
  }
  if (category === undefined || category === '') {
    throw new AppError('Category is required');
  }
}

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;

  validate(title, type, value, category);

  const transaction = 


  return response.json({ ok: 'rudiney post' });
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
