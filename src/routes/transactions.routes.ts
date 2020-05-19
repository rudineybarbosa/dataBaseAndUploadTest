import { Router } from 'express';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  return response.json({ ok: 'rudiney get' });
});

transactionsRouter.post('/', async (request, response) => {
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
