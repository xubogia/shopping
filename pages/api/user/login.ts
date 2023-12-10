import { NextApiRequest, NextApiResponse } from 'next';

import { dbConnection } from '../sql';

// 密钥用于签发和验证JWT令牌
const secretKey = '8818637';


// 登录 API 处理函数
export default function handler(req: NextApiRequest, res: NextApiResponse) {



    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            // 查询数据库以获取用户记录
            const sql = `SELECT * FROM user WHERE username = ?`;
            const values = [username];
            dbConnection.query(sql, values, async (err, results: mysql.RowDataPacket[]) => {
                if (err) {
                    console.error('查询数据时出现错误', err);
                    res.status(500).json({ message: '登录失败' });
                } else if (results.length > 0) {
                    // 找到匹配的用户记录
                    const user = results[0];

                    // 使用 bcrypt.compare() 方法比较密码
                    console.log(password);
                    console.log(user.password);

                    if (password===user.password) {
                        // 密码匹配，表示登录成功
                        console.log('登录成功');

                        res.status(200).json({  isLoggedIn: true });
                    } else {
                        // 密码不匹配，登录失败
                        console.log('密码错误');
                        res.status(401).json({ message: '密码错误' });
                    }
                } else {
                    // 没有找到匹配的用户记录，登录失败
                    console.log('用户不存在');
                    res.status(404).json({ message: '用户不存在' });
                }
            });
        } catch (error) {
            // 处理错误情况
            console.error('登录时出现错误', error);
            res.status(500).json({ message: '登录失败' });
        }
    }
    else {
        // 非 POST 和 GET 请求返回 405 Method Not Allowed 错误
        res.status(405).end();
    }
}
