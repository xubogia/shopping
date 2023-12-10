import { NextApiRequest, NextApiResponse } from 'next';
import {dbConnection} from '../../sql';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('posting new bag');
    if (req.method === 'POST') {
        const { userName,id } = req.body;
        console.log(userName,id);
        dbConnection.getConnection((err, connection) => {
            if (err) {
                console.error('Error connecting to database:', err);
                return res.status(500).json({ error: 'Error connecting to database' });
            }

            // 查询数据库中的产品数据
            connection.query('INSERT INTO bag (userName, id) VALUES (?, ?)', [userName, id]);

        });
        console.log('add bag successfully')
        res.status(200).json({ message: 'add bag successfully' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
