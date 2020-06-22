import {Request, Response } from 'express'
import knex from '../database/connection'

class itemsController {
  async index(req : Request, res: Response) {
    const items = await knex('items').select('*')
  
    const serializedItems = items.map(item =>{
      return {
        id : item.id,
        title : item.title,
        //image_utl : `http://localhost:3333/uploads/${item.image}`
        image_utl : `http://192.168.0.104:3333/uploads/${item.image}`
      }
    })
    res.json(serializedItems)
  }
}

export default itemsController