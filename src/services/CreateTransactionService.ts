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
  private transactionRespository: TransactionsRepository;

  constructor(transactionRespository: TransactionsRepository) {
    this.transactionRespository = transactionRespository;
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
      const balance = await this.transactionRespository.getBalance();

      if (balance.total < value) {
        throw new AppError('Saldo insuficiente');
      }
    }

    // validar Categoria
    const categoryRepository = getRepository(Category);
    let categoryFromDB = await categoryRepository.findOne({
      title: category,
    });
    if (!categoryFromDB) {
      categoryFromDB = categoryRepository.create({
        title: category,
      });
    }

    // criar transação
    let transaction = this.transactionRespository.create({
      title,
      type,
      value,
      categoryId: categoryFromDB.id,
    });

    transaction = await this.transactionRespository.save(transaction);

    transaction.category = categoryFromDB;

    return transaction;
  }
}

export default CreateTransactionService;
