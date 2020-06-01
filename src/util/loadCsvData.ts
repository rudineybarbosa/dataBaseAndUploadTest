import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';
import uploadconfig from './upload';

export default async function loadCsv(
  file: Express.Multer.File,
): Promise<string[]> {
  const csvPath = path.join(uploadconfig.directory, file.filename);

  const readCsvStream = fs.createReadStream(csvPath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCsv = readCsvStream.pipe(parseStream);

  const lines = [];

  parseCsv.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCsv.on('end', resolve);
  });

  await fs.promises.unlink(csvPath); // delete temp file

  return lines;
}
