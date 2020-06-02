import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import multer from 'multer';
// import AppError from '../errors/AppError';
import uploadConfig from '../util/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.allWithCascadeRelations();
  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;

  const transactionService = new CreateTransactionService();

  transactionService.validate({ title, type, value, category });

  const responseDTO = await transactionService.execute({
    title,
    type,
    value,
    category,
  });

  return response.json({ responseDTO });
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('import_template'),
  async (request, response) => {
    console.log(request.file);

    const importTransactionsService = new ImportTransactionsService();
    importTransactionsService.execute(request.file);
    return response.json({ ok: 'rudiney import' });
  },
);

export default transactionsRouter;
