import { NextApiRequest, NextApiResponse } from 'next';
import {dbConnection} from '../../sql';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Getting products');

  dbConnection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Error connecting to database' });
    }

    // 查询数据库中的产品数据
    connection.query('SELECT categoryName FROM category', (error, results: {categoryName:string;}[]) => {
      // 释放连接
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Error executing query' });
      }
      const categoryArr=[];
      for (let i = 0; i < results.length; i++){
       categoryArr.push(results[i].categoryName)
      }

      return res.status(200).json(categoryArr);
    });
  });
}
