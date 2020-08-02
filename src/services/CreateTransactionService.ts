// import AppError from '../errors/AppError';

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


    //if(type !== 'outcome' && type !== 'income') {
    //  throw new Error('The type should be income or outcome')
    //}


    const transaction = transactionRepository.create({
      title,
      value,
      type,
    })

    await transactionRepository.save(transaction)

    return transaction

/*
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
    */
  }
}

export default CreateTransactionService;
