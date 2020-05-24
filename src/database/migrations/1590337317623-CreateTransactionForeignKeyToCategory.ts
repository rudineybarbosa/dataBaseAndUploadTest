import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateTransactionForeignKeyToCategory1590337317623
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        name: 'TransactionCategoryFK',
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onUpdate: 'CASCADE',
        onDelete: 'SET null',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropForeignKey('transaction', 'TransactionCategoryFK');
  }
}
