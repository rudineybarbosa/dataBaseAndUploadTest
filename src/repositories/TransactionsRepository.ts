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
    this.transactions = await this.allWithoutCascadeRelations();
    const income = this.transactions.reduce(
      (accumulator, currentTransacation: Transaction) => {
        let value = 0;
        if (currentTransacation.type === 'income') {
          value = currentTransacation.value;
        }

        return accumulator + value;
      },
      0,
    );

    const outcome = this.transactions.reduce(
      (accumulator, currentTransacation: Transaction) => {
        let value = 0;
        if (currentTransacation.type === 'outcome') {
          value = currentTransacation.value;
        }

        return accumulator + value;
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

  public async allWithCascadeRelations(): Promise<Transaction[]> {
    // The `relations` option includes Category object inner transaction
    const transactions = await this.find({ relations: ['category'] });

    return transactions;
  }

  public async allWithoutCascadeRelations(): Promise<Transaction[]> {
    // The `relations` option includes Category object inner transaction
    const transactions = await this.find();

    return transactions;
  }

  public async deleteById(id: string): Promise<void> {
    await this.delete(id);
  }
}

export default TransactionsRepository;
