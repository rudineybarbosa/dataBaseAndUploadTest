// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute(id: string): Promise<void> {
    // TODO

    const transaction = await this.transactionsRepository.findOne(id);
    if (!transaction) {
      throw new AppError('Transaction not found');
    }

    this.transactionsRepository.deleteById(id);
  }
}

export default DeleteTransactionService;
