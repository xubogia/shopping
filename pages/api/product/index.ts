import { NextApiRequest, NextApiResponse } from 'next';
import {dbConnection} from '../sql';

interface Product {
  image: string[];
  title: string;
  id: number;
  category: string;
  price: number;
  status: string;
  size:string[];
}



export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Getting products');

  dbConnection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Error connecting to database' });
    }

    // 查询数据库中的产品数据
    connection.query('SELECT * FROM products', (error, results: Product[]) => {
      // 释放连接
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Error executing query' });
      }

      return res.status(200).json(results);
    });
  });
}
