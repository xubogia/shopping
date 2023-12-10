import { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import formidable from 'formidable';
import { qiniuYun } from './uploadImage';
import { dbConnection } from '../sql';


export const config = {
  api: {
    bodyParser: false,
  },
};

interface EachDetail {
  image: string;
  imageDetail: string;
  size: string[];
  amount: string[];
}

interface Product {
  eachDetail: EachDetail[];
  title: string;
  id?: number;
  category: string;
  status: string;
  detail: string[];
}

interface NewProduct {
  eachDetail: string;
  title: string;
  id: number;
  category: string;
  status: string;
  detail: any[];
  newImage: any[];
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.multiples = true;
    
    let newProduct: Product;
    form.parse(req, async (err: any, fields: NewProduct, files: any) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'File upload failed' });
      }
      const { title, category, status } = fields;
      
      const eachDetail: EachDetail[] = JSON.parse(fields.eachDetail);
      
      const uploadedFiles = Object.values(files) as formidable.File[];
      
      if (uploadedFiles.length === 0) {
        console.log('no files upload');
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const id = year + month + day + hours + minutes + seconds;
        
        const productImagesCount = eachDetail.length;
        const allImagesCount = uploadedFiles.length;
        console.log('all', allImagesCount);
        
        const uploadPromises = uploadedFiles.map(async (file, i) => {
          const filePath = file.filepath;
          const key = `${title}-${file.originalFilename}`;
          const fileURL = await qiniuYun(key, filePath);
          console.log('文件上传成功。URL：', fileURL);
          
          if (i < productImagesCount) {
            // 在需要不同处理的位置使用条件判断
            eachDetail[i].image = fileURL.toString();
            console.log(eachDetail[i].image);
            return null; // 返回 null，因为不需要添加到 detail 数组中
          }
          
          return fileURL.toString(); // 返回 URL，需要添加到 detail 数组中
          
        });
        
        const imageUrls = await Promise.all(uploadPromises);
        
        const detail = [];
        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          if (imageUrl !== null) {
            // 根据不同位置的条件处理不同的逻辑
            if (i < productImagesCount) {
              // 在需要不同处理的位置使用条件判断
              eachDetail[i].image = imageUrl;
              console.log(eachDetail[i].image);
            } else {
              detail.push(imageUrl);
            }
          }
        }
        
        newProduct = {
          eachDetail,
          title,
          category,
          status,
          detail,
        };
        
        console.log(newProduct);
        console.log(newProduct);
        dbConnection.getConnection((err: NodeJS.ErrnoException | null, connection) => {
          if (err) {
            console.error('Error connecting to database:', err);
            return res.status(500).json({ error: 'Error connecting to database' });
          }
          
          // 查询数据库中的产品数据
          connection.query(
            'INSERT INTO products (id,title, category, status,detail,eachDetail) VALUES (?,?, ?, ?, ?, ?)',
            [
              id,
              newProduct.title,
              newProduct.category,
              newProduct.status,
              JSON.stringify(newProduct.detail),
              JSON.stringify(newProduct.eachDetail),
            ],
          );
        });
        res.status(200).json({ message: 'add product successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'File upload failed' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}