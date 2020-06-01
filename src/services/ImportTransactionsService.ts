import Transaction from '../models/Transaction';
import loadCsvData from '../util/loadCsvData';

class ImportTransactionsService {
  async execute(file: Express.Multer.File): Promise<Transaction[] | null> {
    const lines = await loadCsvData(file);

    console.log(lines);

    return null;
  }
}

export default ImportTransactionsService;
