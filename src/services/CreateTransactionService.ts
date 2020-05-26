// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  private transactionRepository: TransactionsRepository;

  constructor(transactionRepository: TransactionsRepository) {
    this.transactionRepository = transactionRepository;
  }

  public async execute({
    title,
    type,
    value,
    category,
  }: TransactionDTO): Promise<Transaction | null> {
    // TODO
    // verificar saldo
    if (type === 'outcome') {
      const balance = await this.transactionRepository.getBalance();

      if (balance.total < value) {
        throw new AppError('Saldo insuficiente');
      }
    }

    // validar Categoria
    const categoryRepository = getRepository(Category);
    let categoryObj = await categoryRepository.findOne({
      title: category,
    });
    if (!categoryObj) {
      categoryObj = categoryRepository.create({
        title: category,
      });

      categoryObj = await categoryRepository.save(categoryObj);
    }

    // const transRepos = getRepository(Transaction);
    // criar transação
    let transaction = this.transactionRepository.create({
      title,
      type,
      value,
      categoryId: categoryObj.id,
    });

    transaction = await this.transactionRepository.save(transaction);

    transaction.category = categoryObj;

    return transaction;
  }
}

export default CreateTransactionService;
