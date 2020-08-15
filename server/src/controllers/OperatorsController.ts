import db from '../database/connection';
import { Request, Response, text } from 'express'

import bcrypt, { compareSync } from 'bcrypt';

const saltRounds = 10;

interface operator {
  name: string,
  lastName: string,
  email: string,
  password: string
}

export default class OperatorsController {

  async login(request: Request, response: Response) {
    const {
      email,
      password
    } = request.body;

    const trx = await db.transaction();

    try {
      const totalOperators = await trx.select().from('operators')
      const operator = await totalOperators.find((user: operator) => user.email == email)
      const operatorInfo = { name: operator.name, lastName: operator.lastName, email: operator.email }

      if (await operator == null) {
        response.status(400).json({
          message: 'User not found',
          status: 400
        });
      }

      await trx.commit();
      if (await bcrypt.compare(password, operator.password)) {
        return response.status(200).json({ message: 'Success', status: 200,  response: operatorInfo })
      } else {
        return response.status(405).json({ message: 'Not Allowed', status: 405 })
      }

    } catch (err) {
      return response.send('Erro')
    }
  }

  async index(request: Request, response: Response) {

    const trx = await db.transaction();
    try {
      const totalOperators = await trx.select().from('operators')
      await trx.commit();
      return response.json(totalOperators)
    } catch (err) {
      return response.send('Erro')
    }

  }

  async create(request: Request, response: Response) {
    const {
      name,
      lastName,
      email,
      password
    } = request.body;

    const trx = await db.transaction();

    try {

      bcrypt.hash(password, saltRounds, async function (err, hash) {

        let operator = { name, lastName, email, password: hash }

        await trx('operators').insert(operator)

        await trx.commit();
      });
      return response.status(201).json({ name, lastName });
    } catch (err) {
      await trx.rollback()
      return response.status(400).json({
        error: 'Unexpected error while creating new class'
      });
    }

  }
}
