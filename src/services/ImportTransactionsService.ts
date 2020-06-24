import { getRepository, In, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import loadCsvData from '../util/loadCsvData';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  async execute(file: Express.Multer.File): Promise<Transaction[] | null> {
    const { transactionsFromFile, categoriesFromFile } = await loadCsvData(
      file,
    );

    const categoryRepository = getRepository(Category);

    let newCategoriesTitles: string[] = [];

    const uniqueCategoriesTitlesFromCSV = [...new Set(categoriesFromFile)];

    const categoriesFromDB = await categoryRepository.find({
      where: {
        title: In(uniqueCategoriesTitlesFromCSV),
      },
    });

    const categoriesTitlesFromDB = categoriesFromDB.map(
      (category: Category) => category.title,
    );

    newCategoriesTitles = uniqueCategoriesTitlesFromCSV.filter(
      category => !categoriesTitlesFromDB.includes(category),
    );

    const newCategories = categoryRepository.create(
      newCategoriesTitles.map(title => ({ title })),
    );

    await categoryRepository.save(newCategories);

    const allCategories = [...newCategories, ...categoriesFromDB];

    const transactionRepository = getCustomRepository(TransactionsRepository);

    const newTransactions = transactionRepository.create(
      transactionsFromFile.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: allCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(newTransactions);

    return newTransactions;
  }
}

export default ImportTransactionsService;
