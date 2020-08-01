// import AppError from '../errors/AppError';

import TransactionsRepository from '../models/Transaction';
import Category from '../models/Category';
import { getCustomRepository, FindOperator, FindOperatorType, getRepository } from 'typeorm'
import Transaction from '../models/Transaction';

interface Request {
  title: string
  value: number
  type: "income" | "outcome"
  category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category }:Request): Promise<Transaction> {

    const transactionRepository = getRepository(TransactionsRepository)
    const categoryRepository = getRepository(Category)


    if(type !== 'outcome' && type !== 'income') {
      throw new Error('The type should be income or outcome')
    }

    let findedCategory = await categoryRepository.findOne({
      where: {title : category
    },
  })

    if(findedCategory) {

      const createdTransaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: findedCategory.id
      })

      transactionRepository.save(createdTransaction)
    } else {

    const createdCategory = categoryRepository.create({
      title,
    })

    categoryRepository.save(createdCategory)

    const createdTransaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: createdCategory.id
    })

    transactionRepository.save(createdTransaction)


  }

    return
  }
}

export default CreateTransactionService;
