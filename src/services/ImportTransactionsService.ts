
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import fs from 'fs' //abrir e editar o arquivo
import { In, getRepository, getCustomRepository } from 'typeorm'
import csvParse from 'csv-parse'
import { response } from 'express';
import TransactionRepository from '../repositories/TransactionsRepository'


interface TransactionCSV {
  title: string,
  type: 'income' | 'outcome'
  value: number,
  category: string
}



class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath)
    const categoriesRepository = getRepository(Category)
    const transactionsRepository = getCustomRepository(TransactionRepository)


    const parsers = csvParse({
      //delimiter: ',' delimitador como ',' , porem n precisamos passar nesse caso, pois , é padrao
      from_line: 2, //começa da linha 2
    })

    const transactions: TransactionCSV[] = []
    const categories: string[] = []

    const parseCSV = contactsReadStream.pipe(parsers) //lerá a linha após estar disponivel

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim()
        ) //percorrera todas as celulas  e validara

        if( !title || !type || !value ) return

        categories.push(category)

        transactions.push({title, type, value, category}) //percorrera todas as linhas e salvara em um array
      })


  await new Promise(resolve => parseCSV.on('end', resolve)) //quando o evento end for emitido, retornara

  const existentCategories = await categoriesRepository.find({
    where: {
      title: In(categories) //filtra as categorias do csv que ja existem no banco de dados
     }
  })

  const existentCategoriesTitles = await existentCategories.map(
    (Category: Category) => Category.title, //categoria que ja existe
  )

  const addCategoryTitles = categories
  .filter(category => !existentCategoriesTitles.includes(category)) //os que nao estao no banco
  .filter((value, index, self) => self.indexOf(value) === index) //retirar os iguais


  const newCategories = categoriesRepository.create(
    addCategoryTitles.map(title => ({
      title,
    }))
  )

  await categoriesRepository.save(newCategories)

  const finalCategories = [...newCategories, ...existentCategories]

  const createdTransactions = transactionsRepository.create(
    transactions.map(transaction => ({
      title: transaction.title,
      type: transaction.type,
      value: transaction.value,
      category: finalCategories.find(
        category => category.title === transaction.category,
      )
    }))
  )

    await transactionsRepository.save(createdTransactions)

    await fs.promises.unlink(filePath) //excluir o file apos a inserção

    return createdTransactions;

  }
}

export default ImportTransactionsService;
