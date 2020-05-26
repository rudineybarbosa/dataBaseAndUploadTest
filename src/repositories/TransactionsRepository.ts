import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private transactions: Transaction[];

  constructor() {
    super();
    this.transactions = [];
  }

  public async getBalance(): Promise<Balance> {
    // TODO
    this.transactions = await this.all();
    const income = this.transactions.reduce(
      (accumulator, currentTransacation: Transaction) => {
        let value = 0;
        if (currentTransacation.type === 'income') {
          value = currentTransacation.value;
        }

        return accumulator + Number(value);
      },
      0,
    );

    const outcome = this.transactions.reduce(
      (accumulator, currentTransacation: Transaction) => {
        let value = 0;
        if (currentTransacation.type === 'outcome') {
          value = currentTransacation.value;
        }

        return accumulator + Number(value);
      },
      0,
    );

    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public async all(): Promise<Transaction[]> {
    const transactions = await this.find();

    return transactions;
  }
}

export default TransactionsRepository;
