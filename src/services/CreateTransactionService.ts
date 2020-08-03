 import AppError from '../errors/AppError';

import Category from '../models/Category';
import { getCustomRepository, FindOperator, FindOperatorType, getRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository'

import Transaction from '../models/Transaction';

interface Request {
  title: string
  type: "income" | "outcome"
  value: number
  category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category }:Request): Promise<Transaction> {

    const transactionRepository = getCustomRepository(TransactionsRepository)
    const categoryRepository = getRepository(Category)

    if(type !== 'outcome' && type !== 'income') {
      throw new Error('The type should be income or outcome')
    }

    const { total } = await transactionRepository.getBalance()

    if(type == 'outcome' && value > total) {
      throw new AppError('The value is biggest than total')
    }


    let transactionCategory = await categoryRepository.findOne({
      where: {title : category
    },
  })

    if(!transactionCategory) {

      transactionCategory = categoryRepository.create({
        title: category,
      })

     await categoryRepository.save(transactionCategory)

    }


    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionCategory
    })

    await transactionRepository.save(transaction)

    return transaction

  }
}

export default CreateTransactionService;
