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
    this.transactions = await this.find();
    // eslint-disable-next-line prettier/prettier

    const { income, outcome } = this.transactions.reduce(
      (accumulator, currentTransacation) => {
        switch (currentTransacation.type) {
          case 'income':
            accumulator.income += Number(currentTransacation.value);
            break;

          case 'outcome':
            accumulator.outcome += Number(currentTransacation.value);
            break;

          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  // JUST TO TEST find() with relactions
  public async allWithCascadeRelations(): Promise<Transaction[]> {
    // The `relations` option includes Category object inner transaction
    const transactions = await this.find({ relations: ['category'] });

    return transactions;
  }
}

export default TransactionsRepository;
