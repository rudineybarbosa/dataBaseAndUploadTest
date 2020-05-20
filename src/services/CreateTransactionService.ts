// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  type: string;
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
    // const categoryRepository = getRepository(Category);

    // criar transação
    // const transaction = this.transactionRespository.create({});
    return null;
  }
}

export default CreateTransactionService;
