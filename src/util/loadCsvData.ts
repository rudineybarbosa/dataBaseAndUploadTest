import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';
import uploadconfig from './upload';

interface TransactionFromFile {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface DataFromCSV {
  transactionsFromFile: TransactionFromFile[];
  categoriesFromFile: string[];
}

export default async function loadCsv(
  file: Express.Multer.File,
): Promise<DataFromCSV> {
  const csvPath = path.join(uploadconfig.directory, file.filename);

  const readCsvStream = fs.createReadStream(csvPath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCsv = readCsvStream.pipe(parseStream);

  // const lines: any[] | PromiseLike<any[]> = [];

  const transactionsFromFile: TransactionFromFile[] = [];
  const categoriesFromFile: string[] = [];

  parseCsv.on('data', line => {
    const [title, type, value, category] = line.map((cell: string) =>
      cell.trim(),
    );

    categoriesFromFile.push(category);
    transactionsFromFile.push({ title, type, value, category });
    // lines.push(line);
  });

  await new Promise(resolve => {
    parseCsv.on('end', resolve);
  });

  await fs.promises.unlink(csvPath); // delete temp file

  return { transactionsFromFile, categoriesFromFile };
}

