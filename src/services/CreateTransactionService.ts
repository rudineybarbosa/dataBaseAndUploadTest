import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  type: string;
  value: number;
  category: string;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ResponseDTO {
  transaction: Transaction;
  balance: Balance;
}

interface TransactionToValidate {
  title: string;
  type: string;
  value: number;
  category: string;
}

class CreateTransactionService {
  private transactionRepository: TransactionsRepository;

  constructor() {
    this.transactionRepository = getCustomRepository(TransactionsRepository);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public validate({ title, type, value, category }: TransactionToValidate) {
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

  public async validateCategory(category: string): Promise<Category> {
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

    return categoryObj;
  }

  public async execute({
    title,
    type,
    value,
    category,
  }: TransactionDTO): Promise<Transaction> {
    // eslint-disable-next-line prettier/prettier

    this.validate({ title, type, value, category });

    // verificar saldo
    const { total } = await this.transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Insufficients funds');
    }

    // validar Categoria
    const categoryObj = await this.validateCategory(category);

    // criar transação
    let transaction = this.transactionRepository.create({
      title,
      type,
      value,
      category: categoryObj,
    });

    transaction = await this.transactionRepository.save(transaction);

    delete transaction.categoryId;

    return transaction;
  }
}

export default CreateTransactionService;
