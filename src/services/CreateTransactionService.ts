import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
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
  type: 'income' | 'outcome';
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

  public async execute({
    title,
    type,
    value,
    category,
  }: TransactionDTO): Promise<ResponseDTO | null> {
    // TODO
    // verificar saldo
    let balance: Balance = { income: 0, outcome: 0, total: 0 };
    balance = await this.transactionRepository.getBalance();

    if (type === 'outcome') {
      if (balance.total < value) {
        throw new AppError('Insufficients funds');
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
    balance = await this.transactionRepository.getBalance();

    transaction.category = categoryObj;

    delete transaction.categoryId;

    return { transaction, balance };
  }
}

export default CreateTransactionService;
