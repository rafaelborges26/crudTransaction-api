import Transaction from '../models/Transaction';
import fs from 'fs' //abrir e editar o arquivo
import Transactions from '../models/Transaction'
import csvParse from 'csv-parse'
import { response } from 'express';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath)


    const parsers = csvParse({
      //delimiter: ',' delimitador como ',' , porem n precisamos passar nesse caso, pois , é padrao
      from_line: 2, //começa da linha 2
    })

    const transactions = []
    const categories = []

    const parseCSV = contactsReadStream.pipe(parsers) //lerá a linha após estar disponivel

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim() ) //percorrera todas as celulas  e validara

        if( !title || !type || !value ) return

        categories.push(category)

        transactions.push({title, type, value, category}) //percorrera todas as linhas e salvara em um array
      })

  await new Promise(resolve => parseCSV.on('end', resolve)) //quando o evento end for emitido, retornara

  return {transactions, categories}

  }
}

export default ImportTransactionsService;
